import { ipcMain, shell } from 'electron'
import { IPC } from '../preload/channels'
import { playAlertSound, showPostureNotification } from './notifications'

export function registerIpcHandlers(): void {
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
    showPostureNotification(level)
  })

  ipcMain.handle(IPC.SOUND_PLAY_ALERT, () => {
    playAlertSound()
  })
}
