import { useEffect, useRef } from 'react'
import type { PostureStatus } from '@/posture/types'
import { api } from '@/lib/ipc'

export interface UseStatusAlertsOptions {
  notifications: boolean
  sound: boolean
}

export function useStatusAlerts(
  status: PostureStatus,
  { notifications, sound }: UseStatusAlertsOptions
): void {
  const lastFiredAtRef = useRef<Record<'warning' | 'poor', number>>({ warning: 0, poor: 0 })
  const previousStatusRef = useRef<PostureStatus>('good')
  const COOLDOWN_MS = 5 * 60 * 1000

  useEffect(() => {
    const previous = previousStatusRef.current
    previousStatusRef.current = status

    if (status === 'good' || status === previous) return
    const level = status as 'warning' | 'poor'
    const now = Date.now()
    if (now - lastFiredAtRef.current[level] < COOLDOWN_MS) return
    lastFiredAtRef.current[level] = now

    if (notifications) void api.notifyPosture(level)
    if (sound && level === 'poor') void api.playAlertSound()
  }, [status, notifications, sound, COOLDOWN_MS])
}
