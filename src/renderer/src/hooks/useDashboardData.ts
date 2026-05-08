import { useCallback, useEffect, useState } from 'react'
import { SNAPSHOT_INTERVAL_MS } from './useSnapshotPersistence'

interface HourBucket {
  hour: number
  good: number
  warning: number
  poor: number
}

interface DayBucket {
  date: string
  good: number
  warning: number
  poor: number
}

interface SessionRow {
  id: number
  started_at: string
  ended_at: string | null
  total_duration_seconds: number
  good_seconds: number
  warning_seconds: number
  poor_seconds: number
}

export interface DashboardData {
  today: HourBucket[]
  week: DayBucket[]
  activeSession: SessionRow | null
  totalSnapshotsToday: number
}

export interface UseDashboardData {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refresh: () => void
}

const SECONDS_PER_SNAPSHOT = SNAPSHOT_INTERVAL_MS / 1000
const REFRESH_MS = 30_000

export function useDashboardData(): UseDashboardData {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const [today, week, activeSession] = await Promise.all([
        window.api.db.getTodayStats(),
        window.api.db.getWeekStats(),
        window.api.db.getActiveSession()
      ])
      const totalSnapshotsToday = today.reduce(
        (sum, b) => sum + b.good + b.warning + b.poor,
        0
      )
      setData({ today, week, activeSession, totalSnapshotsToday })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const id = setInterval(() => void refresh(), REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { data, loading, error, refresh }
}

export function snapshotsToMinutes(count: number): number {
  return Math.round((count * SECONDS_PER_SNAPSHOT) / 60)
}
