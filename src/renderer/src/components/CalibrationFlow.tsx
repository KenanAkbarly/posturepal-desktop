import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkles } from 'lucide-react'
import type { PostureMetrics } from '@/posture/types'
import { BaselineAccumulator, type BaselineProfile } from '@/posture/calibration'

const COUNTDOWN_SECONDS = 3
const CAPTURE_MS = 5000

type Phase = 'idle' | 'countdown' | 'capturing' | 'done'

interface CalibrationFlowProps {
  metrics: PostureMetrics | null
  onComplete: (baseline: BaselineProfile) => void
}

export function CalibrationFlow({ metrics, onComplete }: CalibrationFlowProps): React.JSX.Element {
  const [phase, setPhase] = useState<Phase>('idle')
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [progress, setProgress] = useState(0)
  const [baseline, setBaseline] = useState<BaselineProfile | null>(null)
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
          setBaseline(result)
          onCompleteRef.current(result)
          setPhase('done')
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

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Calibration
        </CardTitle>
        <CardDescription>
          Sit naturally facing your camera. We will capture a 5-second baseline of your normal
          posture. Future alerts will compare against this — not generic thresholds.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {phase === 'idle' && (
          <div className="flex justify-end">
            <Button onClick={() => setPhase('countdown')}>Start calibration</Button>
          </div>
        )}
        {phase === 'countdown' && (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="text-7xl font-bold tabular-nums">{countdown}</div>
            <p className="text-sm text-muted-foreground">Get ready…</p>
          </div>
        )}
        {phase === 'capturing' && (
          <div className="flex flex-col gap-3 py-4">
            <p className="text-center text-sm">Hold still — capturing baseline</p>
            <Progress value={progress} />
          </div>
        )}
        {phase === 'done' && baseline && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3 rounded-lg border p-4 text-sm">
              <Stat label="CVA" value={`${baseline.cva.toFixed(1)}°`} />
              <Stat label="Asymmetry" value={`${baseline.shoulderAsymmetry.toFixed(1)}%`} />
              <Stat label="Alignment" value={`${baseline.alignment.toFixed(1)}°`} />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Baseline captured from {baseline.sampleCount} samples.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPhase('idle')}>
                Recalibrate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-mono text-lg">{value}</span>
    </div>
  )
}
