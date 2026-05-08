import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, BarChart3 } from 'lucide-react'
import { StatusBarChart, type StatusBarDatum } from '@/components/StatusBarChart'
import { snapshotsToMinutes, useDashboardData } from '@/hooks/useDashboardData'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Dashboard(): React.JSX.Element {
  const { data, loading, error, refresh } = useDashboardData()

  if (loading && !data) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading dashboard…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Couldn&apos;t load dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="outline" onClick={() => refresh()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalToday = data?.totalSnapshotsToday ?? 0
  const isEmpty = totalToday === 0 && (data?.week ?? []).every((d) => d.good + d.warning + d.poor === 0)

  if (isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" /> No data yet
            </CardTitle>
            <CardDescription>
              Calibrate from the Monitor tab to start tracking. The Dashboard will fill in as data
              accumulates (one snapshot every 30 seconds).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const todayData: StatusBarDatum[] = (data?.today ?? []).map((b) => ({
    label: `${b.hour.toString().padStart(2, '0')}`,
    good: snapshotsToMinutes(b.good),
    warning: snapshotsToMinutes(b.warning),
    poor: snapshotsToMinutes(b.poor)
  }))
  const weekData: StatusBarDatum[] = (data?.week ?? []).map((b) => ({
    label: DAY_LABELS[new Date(b.date + 'T00:00:00').getDay()] ?? b.date.slice(5),
    good: snapshotsToMinutes(b.good),
    warning: snapshotsToMinutes(b.warning),
    poor: snapshotsToMinutes(b.poor)
  }))

  const todayGood = todayData.reduce((s, d) => s + d.good, 0)
  const todayWarning = todayData.reduce((s, d) => s + d.warning, 0)
  const todayPoor = todayData.reduce((s, d) => s + d.poor, 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Posture statistics across time.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refresh()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Good" value={todayGood} tone="good" />
        <SummaryCard label="Warning" value={todayWarning} tone="warning" />
        <SummaryCard label="Poor" value={todayPoor} tone="poor" />
      </div>

      {data?.activeSession && <ActiveSessionCard session={data.activeSession} />}

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s timeline</CardTitle>
          <CardDescription>Posture quality per hour (minutes per status).</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusBarChart data={todayData} height={220} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
          <CardDescription>Daily totals across the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusBarChart data={weekData} height={220} />
        </CardContent>
      </Card>
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: number
  tone: 'good' | 'warning' | 'poor'
}

const TONE_COLOR: Record<SummaryCardProps['tone'], string> = {
  good: 'text-emerald-500',
  warning: 'text-amber-500',
  poor: 'text-red-500'
}

function SummaryCard({ label, value, tone }: SummaryCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold tabular-nums ${TONE_COLOR[tone]}`}>{value}</span>
          <span className="text-xs text-muted-foreground">min today</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface SessionRow {
  started_at: string
}

function ActiveSessionCard({ session }: { session: SessionRow }): React.JSX.Element {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const elapsedMs = now - new Date(session.started_at).getTime()
  const minutes = Math.floor(elapsedMs / 60_000)
  const seconds = Math.floor((elapsedMs % 60_000) / 1000)
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active session
          </CardTitle>
          <CardDescription className="text-xs">
            Started {new Date(session.started_at).toLocaleTimeString()}
          </CardDescription>
        </div>
        <Badge variant="secondary">live</Badge>
      </CardHeader>
      <CardContent>
        <span className="font-mono text-3xl tabular-nums">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </CardContent>
    </Card>
  )
}
