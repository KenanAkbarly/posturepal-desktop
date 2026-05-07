import { useSyncExternalStore } from 'react'
import type { BaselineProfile, SensitivityLevel } from '@/posture/calibration'

export interface AppSettings {
  notifications: boolean
  sound: boolean
  language: 'en' | 'tr'
  sensitivity: SensitivityLevel
  useClinicalLayer: boolean
  baseline: BaselineProfile | null
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  sound: false,
  language: 'en',
  sensitivity: 'medium',
  useClinicalLayer: true,
  baseline: null
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
  setBaseline(baseline: BaselineProfile | null): void {
    state = { ...state, baseline }
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
