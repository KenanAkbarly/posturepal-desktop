import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC } from './channels'

interface BaselineRecord {
  cva: number
  shoulder_asymmetry: number
  alignment: number
  captured_at: string
  sample_count: number
}

interface SnapshotInput {
  sessionId: number
  timestamp: string
  cva: number | null
  shoulderAsymmetry: number | null
  alignment: number | null
  status: 'good' | 'warning' | 'poor'
}

interface SessionTotals {
  totalSeconds: number
  goodSeconds: number
  warningSeconds: number
  poorSeconds: number
}

interface SessionRow {
  id: number
  started_at: string
  ended_at: string | null
  total_duration_seconds: number
  good_seconds: number
  warning_seconds: number
  poor_seconds: number
}

interface HourBucket {
  hour: number
  good: number
  warning: number
  poor: number
}

interface DayBucket {
  date: string
  good: number
  warning: number
  poor: number
}

const dbApi = {
  getAllSettings: (): Promise<Record<string, string>> =>
    ipcRenderer.invoke(IPC.DB_GET_ALL_SETTINGS),
  saveSetting: (key: string, value: string): Promise<void> =>
    ipcRenderer.invoke(IPC.DB_SAVE_SETTING, key, value),
  getBaseline: (): Promise<BaselineRecord | null> => ipcRenderer.invoke(IPC.DB_GET_BASELINE),
  saveBaseline: (record: BaselineRecord): Promise<void> =>
    ipcRenderer.invoke(IPC.DB_SAVE_BASELINE, record),
  clearBaseline: (): Promise<void> => ipcRenderer.invoke(IPC.DB_CLEAR_BASELINE),
  startSession: (): Promise<number> => ipcRenderer.invoke(IPC.DB_START_SESSION),
  endSession: (id: number, totals: SessionTotals): Promise<void> =>
    ipcRenderer.invoke(IPC.DB_END_SESSION, id, totals),
  insertSnapshot: (snapshot: SnapshotInput): Promise<void> =>
    ipcRenderer.invoke(IPC.DB_INSERT_SNAPSHOT, snapshot),
  getTodayStats: (): Promise<HourBucket[]> => ipcRenderer.invoke(IPC.DB_GET_TODAY_STATS),
  getWeekStats: (): Promise<DayBucket[]> => ipcRenderer.invoke(IPC.DB_GET_WEEK_STATS),
  getActiveSession: (): Promise<SessionRow | null> =>
    ipcRenderer.invoke(IPC.DB_GET_ACTIVE_SESSION)
}

type CameraAccessStatus = 'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'

const api = {
  openCameraSettings: (): Promise<void> => ipcRenderer.invoke(IPC.SYSTEM_OPEN_CAMERA_SETTINGS),
  getCameraStatus: (): Promise<CameraAccessStatus> =>
    ipcRenderer.invoke(IPC.SYSTEM_GET_CAMERA_STATUS),
  requestCameraAccess: (): Promise<boolean> =>
    ipcRenderer.invoke(IPC.SYSTEM_REQUEST_CAMERA_ACCESS),
  notifyPosture: (payload: {
    title: string
    subtitle?: string
    body: string
  }): Promise<void> => ipcRenderer.invoke(IPC.NOTIFY_POSTURE, payload),
  testNotification: (): Promise<void> => ipcRenderer.invoke(IPC.NOTIFY_TEST),
  playAlertSound: (): Promise<void> => ipcRenderer.invoke(IPC.SOUND_PLAY_ALERT),
  setTrayStatus: (status: 'good' | 'warning' | 'poor' | 'idle'): Promise<void> =>
    ipcRenderer.invoke(IPC.TRAY_SET_STATUS, status),
  db: dbApi
}

export type AppApi = typeof api

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
