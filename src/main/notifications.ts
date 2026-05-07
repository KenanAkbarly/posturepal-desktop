import { Notification, shell } from 'electron'

const COOLDOWN_MS = 5 * 60 * 1000
const lastFiredAt: Record<'warning' | 'poor', number> = { warning: 0, poor: 0 }

const messages = {
  warning: { title: 'PosturePal', body: 'Adjust your posture.' },
  poor: { title: 'PosturePal', body: 'Poor posture detected. Sit up straight.' }
}

export function showPostureNotification(level: 'warning' | 'poor'): void {
  if (!Notification.isSupported()) return
  const now = Date.now()
  if (now - lastFiredAt[level] < COOLDOWN_MS) return
  lastFiredAt[level] = now
  const { title, body } = messages[level]
  new Notification({ title, body, silent: true }).show()
}

export function playAlertSound(): void {
  shell.beep()
}

export function resetCooldown(): void {
  lastFiredAt.warning = 0
  lastFiredAt.poor = 0
}
