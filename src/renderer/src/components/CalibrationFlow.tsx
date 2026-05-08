import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { AlertTriangle, Sparkles } from 'lucide-react'
import type { PostureMetrics } from '@/posture/types'
import {
  BaselineAccumulator,
  type BaselineProfile
} from '@/posture/calibration'
import {
  classifyAgainstClinical,
  CLINICAL_METRIC_INFO,
  CLINICAL_THRESHOLDS,
  type ClinicalMetric
} from '@/posture/clinical-thresholds'
import { isBaselineWithinClinicalHealthy } from '@/posture/hybrid-classifier'

const COUNTDOWN_SECONDS = 3
const CAPTURE_MS = 5000

type Phase = 'idle' | 'countdown' | 'capturing' | 'review' | 'unsafe' | 'done'

interface CalibrationFlowProps {
  metrics: PostureMetrics | null
  onComplete: (baseline: BaselineProfile) => void
}

export function CalibrationFlow({ metrics, onComplete }: CalibrationFlowProps): React.JSX.Element {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<Phase>('idle')
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [progress, setProgress] = useState(0)
  const [pendingBaseline, setPendingBaseline] = useState<BaselineProfile | null>(null)
  const [confirmSkipOpen, setConfirmSkipOpen] = useState(false)
  const accumulator = useRef(new BaselineAccumulator())
  const captureStartRef = useRef(0)
  const metricsRef = useRef<PostureMetrics | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    metricsRef.current = metrics
  }, [metrics])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (phase !== 'countdown') return
    setCountdown(COUNTDOWN_SECONDS)
    let n = COUNTDOWN_SECONDS
    const id = setInterval(() => {
      n -= 1
      setCountdown(n)
      if (n <= 0) {
        clearInterval(id)
        accumulator.current.reset()
        captureStartRef.current = performance.now()
        setProgress(0)
        setPhase('capturing')
      }
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'capturing') return
    let raf = 0
    const tick = (): void => {
      if (metricsRef.current) accumulator.current.add(metricsRef.current)
      const elapsed = performance.now() - captureStartRef.current
      setProgress(Math.min(100, (elapsed / CAPTURE_MS) * 100))
      if (elapsed >= CAPTURE_MS) {
        const result = accumulator.current.result()
        if (result) {
          setPendingBaseline(result)
          setPhase(isBaselineWithinClinicalHealthy(result) ? 'review' : 'unsafe')
        } else {
          setPhase('idle')
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const acceptBaseline = (): void => {
    if (!pendingBaseline) return
    onCompleteRef.current(pendingBaseline)
    setPhase('done')
  }

  return (
    <>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> {t('calibration.title')}
          </CardTitle>
          <CardDescription>{t('calibration.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {phase === 'idle' && (
            <div className="flex justify-end">
              <Button onClick={() => setPhase('countdown')}>{t('calibration.start')}</Button>
            </div>
          )}
          {phase === 'countdown' && (
            <div className="flex flex-col items-center gap-2 py-6">
              <div className="text-7xl font-bold tabular-nums">{countdown}</div>
              <p className="text-sm text-muted-foreground">{t('calibration.getReady')}</p>
            </div>
          )}
          {phase === 'capturing' && (
            <div className="flex flex-col gap-3 py-4">
              <p className="text-center text-sm">{t('calibration.capturing')}</p>
              <Progress value={progress} />
            </div>
          )}
          {phase === 'review' && pendingBaseline && (
            <ReviewPanel
              baseline={pendingBaseline}
              onAccept={acceptBaseline}
              onRetry={() => setPhase('idle')}
            />
          )}
          {phase === 'unsafe' && pendingBaseline && (
            <UnsafePanel
              baseline={pendingBaseline}
              onRetry={() => setPhase('idle')}
              onSkipRequest={() => setConfirmSkipOpen(true)}
            />
          )}
          {phase === 'done' && pendingBaseline && (
            <ReviewPanel
              baseline={pendingBaseline}
              onAccept={() => undefined}
              onRetry={() => setPhase('idle')}
              hideAccept
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmSkipOpen} onOpenChange={setConfirmSkipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('calibration.unsafe.skipDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('calibration.unsafe.skipDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSkipOpen(false)}>
              {t('calibration.unsafe.skipDialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmSkipOpen(false)
                acceptBaseline()
              }}
            >
              {t('calibration.unsafe.skipDialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ReviewPanel({
  baseline,
  onAccept,
  onRetry,
  hideAccept = false
}: {
  baseline: BaselineProfile
  onAccept: () => void
  onRetry: () => void
  hideAccept?: boolean
}): React.JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 rounded-lg border p-4 text-sm">
        <Stat label={t('calibration.metric.cva')} value={`${baseline.cva.toFixed(1)}°`} />
        <Stat
          label={t('calibration.metric.asymmetry')}
          value={`${baseline.shoulderAsymmetry.toFixed(1)}%`}
        />
        <Stat label={t('calibration.metric.alignment')} value={`${baseline.alignment.toFixed(1)}°`} />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t('calibration.samplesCaptured', { count: baseline.sampleCount })}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onRetry}>
          {t('calibration.recapture')}
        </Button>
        {!hideAccept && <Button onClick={onAccept}>{t('calibration.looksGood')}</Button>}
      </div>
    </div>
  )
}

function UnsafePanel({
  baseline,
  onRetry,
  onSkipRequest
}: {
  baseline: BaselineProfile
  onRetry: () => void
  onSkipRequest: () => void
}): React.JSX.Element {
  const { t } = useTranslation()
  const breakdown = classifyAgainstClinical({
    cva: baseline.cva,
    shoulderAsymmetry: baseline.shoulderAsymmetry,
    alignment: baseline.alignment,
    side: 'left'
  })
  const offending = (Object.keys(breakdown.per) as ClinicalMetric[]).filter(
    (m) => breakdown.per[m] !== 'good'
  )
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{t('calibration.unsafe.title')}</p>
          <p className="text-xs text-muted-foreground">{t('calibration.unsafe.description')}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 rounded border bg-background p-3 text-sm">
        {(Object.keys(breakdown.per) as ClinicalMetric[]).map((m) => {
          const value = m === 'shoulderAsymmetry' ? baseline.shoulderAsymmetry : baseline[m]
          const isOffending = offending.includes(m)
          const labelKey = m === 'shoulderAsymmetry' ? 'asymmetry' : m
          return (
            <Stat
              key={m}
              label={t(`calibration.metric.${labelKey}`)}
              value={CLINICAL_METRIC_INFO[m].format(value)}
              detail={
                isOffending
                  ? t('calibration.unsafe.vsHealthy', {
                      value: CLINICAL_THRESHOLDS[m].healthy,
                      unit: CLINICAL_METRIC_INFO[m].unit
                    })
                  : t('calibration.unsafe.ok')
              }
              tone={isOffending ? 'bad' : 'good'}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onSkipRequest}>
          {t('calibration.unsafe.skipAdvanced')}
        </Button>
        <Button onClick={onRetry}>{t('calibration.unsafe.tryAgain')}</Button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  detail,
  tone
}: {
  label: string
  value: string
  detail?: string
  tone?: 'good' | 'bad'
}): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-mono text-lg">{value}</span>
      {detail && (
        <span
          className={`font-mono text-[10px] ${tone === 'bad' ? 'text-red-500' : 'text-emerald-500'}`}
        >
          {detail}
        </span>
      )}
    </div>
  )
}
