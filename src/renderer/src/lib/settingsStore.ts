import { useSyncExternalStore } from 'react'

export interface AppSettings {
  notifications: boolean
  sound: boolean
  language: 'en' | 'tr'
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  sound: false,
  language: 'en'
}

let state: AppSettings = { ...DEFAULT_SETTINGS }
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

export const settingsStore = {
  get(): AppSettings {
    return state
  },
  set(patch: Partial<AppSettings>): void {
    state = { ...state, ...patch }
    emit()
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
}

export function useSettings(): AppSettings {
  return useSyncExternalStore(settingsStore.subscribe, settingsStore.get, settingsStore.get)
}
