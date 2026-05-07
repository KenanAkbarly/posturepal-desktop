import { ipcMain, shell } from 'electron'
import { IPC } from '../preload/channels'

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
}
