import { BrowserWindow, ipcMain, shell } from 'electron'
import { IPC } from '../preload/channels'
import { playAlertSound, showPostureNotification, showTestNotification } from './notifications'
import { setTrayStatus, type TrayStatus } from './tray'

export function registerIpcHandlers(getMainWindow: () => BrowserWindow | null): void {
  ipcMain.handle(IPC.SYSTEM_OPEN_CAMERA_SETTINGS, async () => {
    if (process.platform === 'darwin') {
      await shell.openExternal(
        'x-apple.systempreferences:com.apple.preference.security?Privacy_Camera'
      )
    } else if (process.platform === 'win32') {
      await shell.openExternal('ms-settings:privacy-webcam')
    }
  })

  ipcMain.handle(IPC.NOTIFY_POSTURE, (_event, level: 'warning' | 'poor') => {
    console.log(`[ipc] NOTIFY_POSTURE received: ${level}`)
    showPostureNotification(level)
  })

  ipcMain.handle(IPC.NOTIFY_TEST, () => {
    console.log('[ipc] NOTIFY_TEST received')
    showTestNotification()
  })

  ipcMain.handle(IPC.SOUND_PLAY_ALERT, () => {
    playAlertSound()
  })

  ipcMain.handle(IPC.TRAY_SET_STATUS, (_event, status: TrayStatus) => {
    setTrayStatus(status, getMainWindow)
  })
}
