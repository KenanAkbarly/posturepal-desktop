import { BrowserWindow, ipcMain, shell, systemPreferences } from 'electron'
import { IPC } from '../preload/channels'
import { playAlertSound, showPostureNotification, showTestNotification } from './notifications'
import { setTrayStatus, type TrayStatus } from './tray'
import type {
  BaselineRecord,
  PostureDatabase,
  SessionTotals,
  SnapshotInput
} from './database'

export function registerIpcHandlers(
  getMainWindow: () => BrowserWindow | null,
  db: PostureDatabase
): void {
  ipcMain.handle(IPC.SYSTEM_OPEN_CAMERA_SETTINGS, async () => {
    if (process.platform === 'darwin') {
      await shell.openExternal(
        'x-apple.systempreferences:com.apple.preference.security?Privacy_Camera'
      )
    } else if (process.platform === 'win32') {
      await shell.openExternal('ms-settings:privacy-webcam')
    }
  })

  ipcMain.handle(IPC.SYSTEM_GET_CAMERA_STATUS, () => {
    if (process.platform !== 'darwin') return 'unknown'
    return systemPreferences.getMediaAccessStatus('camera')
  })

  ipcMain.handle(IPC.SYSTEM_REQUEST_CAMERA_ACCESS, async () => {
    if (process.platform !== 'darwin') return true
    const granted = await systemPreferences.askForMediaAccess('camera')
    console.log(`[ipc] camera access request → ${granted ? 'granted' : 'denied'}`)
    return granted
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

  // --- DB handlers ---

  ipcMain.handle(IPC.DB_GET_ALL_SETTINGS, () => db.getAllSettings())

  ipcMain.handle(IPC.DB_SAVE_SETTING, (_event, key: string, value: string) => {
    db.saveSetting(key, value)
  })

  ipcMain.handle(IPC.DB_GET_BASELINE, () => db.getBaseline())

  ipcMain.handle(IPC.DB_SAVE_BASELINE, (_event, record: BaselineRecord) => {
    db.saveBaseline(record)
  })

  ipcMain.handle(IPC.DB_CLEAR_BASELINE, () => {
    db.clearBaseline()
  })

  ipcMain.handle(IPC.DB_START_SESSION, () => db.startSession(new Date().toISOString()))

  ipcMain.handle(
    IPC.DB_END_SESSION,
    (_event, id: number, totals: SessionTotals) => {
      db.endSession(id, new Date().toISOString(), totals)
    }
  )

  ipcMain.handle(IPC.DB_INSERT_SNAPSHOT, (_event, snapshot: SnapshotInput) => {
    db.insertSnapshot(snapshot)
  })

  ipcMain.handle(IPC.DB_GET_TODAY_STATS, () => db.getTodayStats())

  ipcMain.handle(IPC.DB_GET_WEEK_STATS, () => db.getWeekStats())

  ipcMain.handle(IPC.DB_GET_ACTIVE_SESSION, () => db.getActiveSession())
}
