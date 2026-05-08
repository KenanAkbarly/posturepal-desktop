export const IPC = {
  SYSTEM_OPEN_CAMERA_SETTINGS: 'system:openCameraSettings',
  NOTIFY_POSTURE: 'notify:posture',
  NOTIFY_TEST: 'notify:test',
  SOUND_PLAY_ALERT: 'sound:playAlert',
  TRAY_SET_STATUS: 'tray:setStatus',

  DB_GET_ALL_SETTINGS: 'db:getAllSettings',
  DB_SAVE_SETTING: 'db:saveSetting',
  DB_GET_BASELINE: 'db:getBaseline',
  DB_SAVE_BASELINE: 'db:saveBaseline',
  DB_CLEAR_BASELINE: 'db:clearBaseline',
  DB_START_SESSION: 'db:startSession',
  DB_END_SESSION: 'db:endSession',
  DB_INSERT_SNAPSHOT: 'db:insertSnapshot',
  DB_GET_TODAY_STATS: 'db:getTodayStats',
  DB_GET_WEEK_STATS: 'db:getWeekStats',
  DB_GET_ACTIVE_SESSION: 'db:getActiveSession'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]
