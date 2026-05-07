export const IPC = {
  SYSTEM_OPEN_CAMERA_SETTINGS: 'system:openCameraSettings',
  NOTIFY_POSTURE: 'notify:posture',
  NOTIFY_TEST: 'notify:test',
  SOUND_PLAY_ALERT: 'sound:playAlert',
  TRAY_SET_STATUS: 'tray:setStatus'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]
