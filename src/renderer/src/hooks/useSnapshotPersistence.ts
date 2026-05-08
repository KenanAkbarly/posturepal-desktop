import { useEffect, useRef } from 'react'
import type { PostureMetrics, PostureStatus } from '@/posture/types'

export const SNAPSHOT_INTERVAL_MS = 30_000

interface SnapshotPersistenceArgs {
  enabled: boolean
  smoothed: PostureMetrics | null
  status: PostureStatus
}

/**
 * While `enabled`, opens (and reuses) a session and writes one snapshot
 * every SNAPSHOT_INTERVAL_MS using the latest smoothed metrics + status.
 * On unmount or disable, closes the session via IPC.
 */
export function useSnapshotPersistence({
  enabled,
  smoothed,
  status
}: SnapshotPersistenceArgs): void {
  const sessionIdRef = useRef<number | null>(null)
  const counters = useRef({ good: 0, warning: 0, poor: 0, total: 0 })
  const latestRef = useRef<{ metrics: PostureMetrics | null; status: PostureStatus }>({
    metrics: null,
    status: 'good'
  })

  useEffect(() => {
    latestRef.current = { metrics: smoothed, status }
  }, [smoothed, status])

  useEffect(() => {
    if (!enabled) return undefined

    let intervalId: ReturnType<typeof setInterval> | null = null
    let cancelled = false

    void window.api.db
      .startSession()
      .then((id) => {
        if (cancelled) {
          void window.api.db.endSession(id, {
            totalSeconds: 0,
            goodSeconds: 0,
            warningSeconds: 0,
            poorSeconds: 0
          })
          return
        }
        sessionIdRef.current = id
        counters.current = { good: 0, warning: 0, poor: 0, total: 0 }

        intervalId = setInterval(() => {
          const sid = sessionIdRef.current
          if (sid === null) return
          const { metrics, status: s } = latestRef.current
          counters.current.total += SNAPSHOT_INTERVAL_MS / 1000
          counters.current[s] += SNAPSHOT_INTERVAL_MS / 1000
          void window.api.db.insertSnapshot({
            sessionId: sid,
            timestamp: new Date().toISOString(),
            cva: metrics?.cva ?? null,
            shoulderAsymmetry: metrics?.shoulderAsymmetry ?? null,
            alignment: metrics?.alignment ?? null,
            status: s
          })
        }, SNAPSHOT_INTERVAL_MS)
      })
      .catch((e) => console.error('[snapshot] startSession failed', e))

    return () => {
      cancelled = true
      if (intervalId !== null) clearInterval(intervalId)
      const sid = sessionIdRef.current
      if (sid !== null) {
        const { good, warning, poor, total } = counters.current
        void window.api.db.endSession(sid, {
          totalSeconds: Math.round(total),
          goodSeconds: Math.round(good),
          warningSeconds: Math.round(warning),
          poorSeconds: Math.round(poor)
        })
        sessionIdRef.current = null
      }
    }
  }, [enabled])
}
