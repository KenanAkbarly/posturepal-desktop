import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC } from './channels'

const api = {
  openCameraSettings: (): Promise<void> => ipcRenderer.invoke(IPC.SYSTEM_OPEN_CAMERA_SETTINGS),
  notifyPosture: (level: 'warning' | 'poor'): Promise<void> =>
    ipcRenderer.invoke(IPC.NOTIFY_POSTURE, level),
  playAlertSound: (): Promise<void> => ipcRenderer.invoke(IPC.SOUND_PLAY_ALERT),
  setTrayStatus: (status: 'good' | 'warning' | 'poor' | 'idle'): Promise<void> =>
    ipcRenderer.invoke(IPC.TRAY_SET_STATUS, status)
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
