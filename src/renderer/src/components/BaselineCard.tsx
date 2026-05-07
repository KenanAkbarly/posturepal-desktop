import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BaselineDeltas, BaselineProfile } from '@/posture/calibration'

interface BaselineCardProps {
  baseline: BaselineProfile
  deltas: BaselineDeltas | null
  className?: string
}

export function BaselineCard({
  baseline,
  deltas,
  className
}: BaselineCardProps): React.JSX.Element {
  return (
    <Card className={cn('w-full max-w-3xl', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          Your baseline
          <Badge variant="outline" className="font-mono text-[10px]">
            {new Date(baseline.capturedAt).toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-6 pb-4">
        <Row
          label="CVA"
          baseline={`${baseline.cva.toFixed(1)}°`}
          delta={deltas ? formatDelta(deltas.cvaDelta, '°', 'higherBetter') : null}
        />
        <Row
          label="Asymmetry"
          baseline={`${baseline.shoulderAsymmetry.toFixed(1)}%`}
          delta={deltas ? formatDelta(deltas.asymmetryDelta, '%', 'lowerBetter') : null}
        />
        <Row
          label="Alignment"
          baseline={`${baseline.alignment.toFixed(1)}°`}
          delta={deltas ? formatDelta(deltas.alignmentDelta, '°', 'higherBetter') : null}
        />
      </CardContent>
    </Card>
  )
}

interface RowProps {
  label: string
  baseline: string
  delta: { text: string; tone: 'good' | 'bad' | 'neutral' } | null
}

function Row({ label, baseline, delta }: RowProps): React.JSX.Element {
  const toneClass =
    delta?.tone === 'bad'
      ? 'text-red-500'
      : delta?.tone === 'good'
        ? 'text-emerald-500'
        : 'text-muted-foreground'
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-mono text-base">{baseline}</span>
      {delta && <span className={cn('font-mono text-xs', toneClass)}>{delta.text}</span>}
    </div>
  )
}

function formatDelta(
  value: number,
  unit: string,
  direction: 'higherBetter' | 'lowerBetter'
): { text: string; tone: 'good' | 'bad' | 'neutral' } {
  const sign = value > 0 ? '+' : ''
  const text = `${sign}${value.toFixed(1)}${unit} vs baseline`
  if (Math.abs(value) < 0.1) return { text, tone: 'neutral' }
  const isPositive = value > 0
  const tone = (direction === 'higherBetter' ? isPositive : !isPositive) ? 'good' : 'bad'
  return { text, tone }
}
