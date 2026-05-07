import { Notification, shell } from 'electron'

const COOLDOWN_MS = 5 * 60 * 1000
const lastFiredAt: Record<'warning' | 'poor', number> = { warning: 0, poor: 0 }

const messages = {
  warning: { title: 'PosturePal', body: 'Adjust your posture.' },
  poor: { title: 'PosturePal', body: 'Poor posture detected. Sit up straight.' },
  test: { title: 'PosturePal — Test', body: 'If you can see this, notifications work.' }
} as const

function fire(title: string, body: string): boolean {
  if (!Notification.isSupported()) {
    console.warn('[notifications] Notification.isSupported() returned false')
    return false
  }
  const n = new Notification({
    title,
    body,
    silent: false
  })
  n.on('show', () => console.log(`[notifications] shown: ${title}`))
  n.on('failed', (_event, error) => console.error('[notifications] failed:', error))
  n.on('click', () => console.log('[notifications] clicked'))
  n.show()
  console.log(`[notifications] dispatched: ${title}`)
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
  const { title, body } = messages[level]
  fire(title, body)
}

export function showTestNotification(): void {
  console.log('[notifications] test notification requested')
  fire(messages.test.title, messages.test.body)
}

export function playAlertSound(): void {
  shell.beep()
}

export function resetCooldown(): void {
  lastFiredAt.warning = 0
  lastFiredAt.poor = 0
}
