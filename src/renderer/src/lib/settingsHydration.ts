import { settingsStore, type AppSettings } from './settingsStore'
import type { BaselineProfile, SensitivityLevel } from '@/posture/calibration'

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (value === undefined) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function hydrateFromDb(): Promise<void> {
  try {
    const [stored, baselineRow] = await Promise.all([
      window.api.db.getAllSettings(),
      window.api.db.getBaseline()
    ])

    const patch: Partial<AppSettings> = {}
    if (stored.notifications !== undefined)
      patch.notifications = parseJson(stored.notifications, true)
    if (stored.sound !== undefined) patch.sound = parseJson(stored.sound, false)
    if (stored.language !== undefined)
      patch.language = parseJson<AppSettings['language']>(stored.language, 'en')
    if (stored.sensitivity !== undefined)
      patch.sensitivity = parseJson<SensitivityLevel>(stored.sensitivity, 'medium')
    if (stored.useClinicalLayer !== undefined)
      patch.useClinicalLayer = parseJson(stored.useClinicalLayer, true)

    if (baselineRow) {
      const baseline: BaselineProfile = {
        cva: baselineRow.cva,
        shoulderAsymmetry: baselineRow.shoulder_asymmetry,
        alignment: baselineRow.alignment,
        capturedAt: baselineRow.captured_at,
        sampleCount: baselineRow.sample_count
      }
      patch.baseline = baseline
    }

    settingsStore.hydrate(patch)
  } catch (e) {
    console.error('[hydration] failed; continuing with defaults', e)
    settingsStore.hydrate({})
  }
}
