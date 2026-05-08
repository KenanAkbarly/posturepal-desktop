import { useSyncExternalStore } from 'react'
import type { BaselineProfile, SensitivityLevel } from '@/posture/calibration'

export interface AppSettings {
  notifications: boolean
  sound: boolean
  language: 'en' | 'tr'
  sensitivity: SensitivityLevel
  useClinicalLayer: boolean
  baseline: BaselineProfile | null
  hydrated: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  sound: false,
  language: 'en',
  sensitivity: 'medium',
  useClinicalLayer: true,
  baseline: null,
  hydrated: false
}

const PERSISTED_KEYS: Array<keyof AppSettings> = [
  'notifications',
  'sound',
  'language',
  'sensitivity',
  'useClinicalLayer'
]

let state: AppSettings = { ...DEFAULT_SETTINGS }
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

function persistSetting(key: keyof AppSettings, value: AppSettings[keyof AppSettings]): void {
  if (!PERSISTED_KEYS.includes(key)) return
  void window.api.db
    .saveSetting(key as string, JSON.stringify(value))
    .catch((e) => console.error('[settings] saveSetting failed', e))
}

function persistBaseline(baseline: BaselineProfile | null): void {
  if (baseline) {
    void window.api.db
      .saveBaseline({
        cva: baseline.cva,
        shoulder_asymmetry: baseline.shoulderAsymmetry,
        alignment: baseline.alignment,
        captured_at: baseline.capturedAt,
        sample_count: baseline.sampleCount
      })
      .catch((e) => console.error('[settings] saveBaseline failed', e))
  } else {
    void window.api.db
      .clearBaseline()
      .catch((e) => console.error('[settings] clearBaseline failed', e))
  }
}

export const settingsStore = {
  get(): AppSettings {
    return state
  },
  set(patch: Partial<AppSettings>): void {
    state = { ...state, ...patch }
    emit()
    for (const k of Object.keys(patch) as Array<keyof AppSettings>) {
      persistSetting(k, patch[k] as AppSettings[keyof AppSettings])
    }
  },
  setBaseline(baseline: BaselineProfile | null): void {
    state = { ...state, baseline }
    emit()
    persistBaseline(baseline)
  },
  hydrate(patch: Partial<AppSettings>): void {
    state = { ...state, ...patch, hydrated: true }
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
