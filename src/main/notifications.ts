import { Notification, shell } from 'electron'

export interface PostureNotificationPayload {
  title: string
  subtitle?: string
  body: string
}

function fire(copy: PostureNotificationPayload): boolean {
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
  n.on('show', () => console.log(`[notifications] shown: ${copy.title} — ${copy.body}`))
  n.on('failed', (_event, error) => console.error('[notifications] failed:', error))
  n.on('click', () => console.log('[notifications] clicked'))
  n.on('close', () => console.log(`[notifications] closed: ${copy.title}`))
  n.show()
  console.log(`[notifications] dispatched: ${copy.title}`)
  return true
}

export function showPostureNotification(payload: PostureNotificationPayload): void {
  fire(payload)
}

export function showTestNotification(): void {
  console.log('[notifications] test notification requested')
  fire({
    title: 'PosturePal — Test',
    subtitle: 'Notifications are working',
    body: 'If you see this banner, your OS notification settings are correct.'
  })
}

export function playAlertSound(): void {
  shell.beep()
}
