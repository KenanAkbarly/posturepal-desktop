import { Frown, Meh, Smile } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { PostureMetrics, PostureStatus } from '@/posture/types'
import { classifyMetric } from '@/posture/calculations'

interface StatusIndicatorProps {
  status: PostureStatus
  metrics: PostureMetrics | null
  className?: string
}

const STATUS_LABEL: Record<PostureStatus, string> = {
  good: 'Good posture',
  warning: 'Adjust your posture',
  poor: 'Poor posture detected'
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
  metrics,
  className
}: StatusIndicatorProps): React.JSX.Element {
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
        <div className={cn('text-center text-2xl font-semibold', STATUS_COLOR[status])}>
          {STATUS_LABEL[status]}
        </div>
        {metrics && (
          <div className="grid w-full grid-cols-3 gap-6">
            <MetricBar
              label="CVA"
              value={metrics.cva}
              unit="°"
              max={90}
              status={classifyMetric('cva', metrics.cva)}
            />
            <MetricBar
              label="Asymmetry"
              value={metrics.shoulderAsymmetry}
              unit="%"
              max={20}
              status={classifyMetric('shoulderAsymmetry', metrics.shoulderAsymmetry)}
            />
            <MetricBar
              label="Alignment"
              value={metrics.alignment}
              unit="°"
              max={180}
              status={classifyMetric('alignment', metrics.alignment)}
            />
          </div>
        )}
      </CardContent>
    </Card>
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
