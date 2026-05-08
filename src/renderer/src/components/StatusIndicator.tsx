import { useTranslation } from 'react-i18next'
import { Frown, Meh, Smile, ShieldAlert, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { PostureMetrics, PostureStatus } from '@/posture/types'
import type { HybridClassification } from '@/posture/hybrid-classifier'
import {
  classifyAsymmetryClinical,
  classifyCvaClinical,
  classifyAlignmentClinical
} from '@/posture/clinical-thresholds'
import { resolveDetail } from '@/lib/resolveDetail'

interface StatusIndicatorProps {
  status: PostureStatus
  classification: HybridClassification | null
  metrics: PostureMetrics | null
  className?: string
}

const STATUS_LABEL_KEY: Record<PostureStatus, string> = {
  good: 'status.good',
  warning: 'status.warning',
  poor: 'status.poor'
}

const STATUS_COLOR: Record<PostureStatus, string> = {
  good: 'text-emerald-500',
  warning: 'text-amber-500',
  poor: 'text-red-500'
}

const STATUS_BG: Record<PostureStatus, string> = {
  good: 'bg-emerald-500/10 ring-emerald-500/30',
  warning: 'bg-amber-500/10 ring-amber-500/30',
  poor: 'bg-red-500/10 ring-red-500/30'
}

const STATUS_ICON: Record<PostureStatus, typeof Smile> = {
  good: Smile,
  warning: Meh,
  poor: Frown
}

const METRIC_BAR = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  poor: 'bg-red-500'
} as const

export function StatusIndicator({
  status,
  classification,
  metrics,
  className
}: StatusIndicatorProps): React.JSX.Element {
  const { t } = useTranslation()
  const Icon = STATUS_ICON[status]
  return (
    <Card className={cn('w-full max-w-3xl', className)}>
      <CardContent className="flex flex-col items-center gap-6 p-6">
        <div
          className={cn(
            'flex h-32 w-32 items-center justify-center rounded-full ring-8',
            STATUS_BG[status]
          )}
        >
          <Icon className={cn('h-20 w-20', STATUS_COLOR[status])} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className={cn('text-center text-2xl font-semibold', STATUS_COLOR[status])}>
            {t(STATUS_LABEL_KEY[status])}
          </div>
          {classification && <ReasonBanner classification={classification} />}
        </div>
        {metrics && (
          <div className="grid w-full grid-cols-3 gap-6">
            <MetricBar
              label={t('baseline.metric.cva')}
              value={metrics.cva}
              unit="°"
              max={90}
              status={classifyCvaClinical(metrics.cva)}
            />
            <MetricBar
              label={t('baseline.metric.asymmetry')}
              value={metrics.shoulderAsymmetry}
              unit="%"
              max={20}
              status={classifyAsymmetryClinical(metrics.shoulderAsymmetry)}
            />
            <MetricBar
              label={t('baseline.metric.alignment')}
              value={metrics.alignment}
              unit="°"
              max={180}
              status={classifyAlignmentClinical(metrics.alignment)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ReasonBanner({
  classification
}: {
  classification: HybridClassification
}): React.JSX.Element {
  const { t } = useTranslation()
  const { reason, detail } = classification
  const showClinical = reason === 'clinical' || reason === 'both' || reason === 'no-baseline'
  const showPersonal = reason === 'personal' || reason === 'both'
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-center text-sm text-muted-foreground">{resolveDetail(t, detail)}</p>
      <div className="flex items-center gap-1.5">
        {showClinical && (
          <Badge
            variant="outline"
            className="gap-1 border-red-500/30 bg-red-500/5 text-[10px] text-red-500"
          >
            <ShieldAlert className="h-3 w-3" /> {t('status.badge.clinical')}
          </Badge>
        )}
        {showPersonal && (
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 bg-amber-500/5 text-[10px] text-amber-500"
          >
            <User className="h-3 w-3" /> {t('status.badge.personal')}
          </Badge>
        )}
        {reason === 'good' && (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-500/5 text-[10px] text-emerald-500"
          >
            {t('status.badge.healthy')}
          </Badge>
        )}
      </div>
    </div>
  )
}

interface MetricBarProps {
  label: string
  value: number
  unit: string
  max: number
  status: PostureStatus
}

function MetricBar({ label, value, unit, max, status }: MetricBarProps): React.JSX.Element {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={cn('font-mono', STATUS_COLOR[status])}>
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <Progress value={pct} indicatorClassName={METRIC_BAR[status]} />
    </div>
  )
}
