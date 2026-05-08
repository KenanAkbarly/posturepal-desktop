import { Notification, shell } from 'electron'

const COOLDOWN_MS = 5 * 60 * 1000
const lastFiredAt: Record<'warning' | 'poor', number> = { warning: 0, poor: 0 }

interface NotificationCopy {
  title: string
  subtitle?: string
  body: string
}

const messages: Record<'warning' | 'poor' | 'test', NotificationCopy> = {
  warning: {
    title: 'PosturePal',
    subtitle: 'Adjust your posture',
    body: 'Sit up straight, head over shoulders.'
  },
  poor: {
    title: 'PosturePal',
    subtitle: 'Poor posture detected',
    body: 'Sit up straight — your posture has slipped beyond safe range.'
  },
  test: {
    title: 'PosturePal — Test',
    subtitle: 'Notifications are working',
    body: 'If you see this banner, your OS notification settings are correct.'
  }
}

function fire(copy: NotificationCopy): boolean {
  if (!Notification.isSupported()) {
    console.warn('[notifications] Notification.isSupported() returned false')
    return false
  }
  const n = new Notification({
    title: copy.title,
    subtitle: copy.subtitle,
    body: copy.body,
    silent: false,
    urgency: 'critical',
    timeoutType: 'never'
  })
  n.on('show', () => console.log(`[notifications] shown: ${copy.title}`))
  n.on('failed', (_event, error) => console.error('[notifications] failed:', error))
  n.on('click', () => console.log('[notifications] clicked'))
  n.on('close', () => console.log(`[notifications] closed: ${copy.title}`))
  n.show()
  console.log(`[notifications] dispatched: ${copy.title}`)
  return true
}

export function showPostureNotification(level: 'warning' | 'poor'): void {
  const now = Date.now()
  const elapsed = now - lastFiredAt[level]
  if (elapsed < COOLDOWN_MS) {
    console.log(
      `[notifications] cooldown active for ${level} (${Math.round((COOLDOWN_MS - elapsed) / 1000)}s remaining)`
    )
    return
  }
  lastFiredAt[level] = now
  fire(messages[level])
}

export function showTestNotification(): void {
  console.log('[notifications] test notification requested')
  fire(messages.test)
}

export function playAlertSound(): void {
  shell.beep()
}

export function resetCooldown(): void {
  lastFiredAt.warning = 0
  lastFiredAt.poor = 0
}
