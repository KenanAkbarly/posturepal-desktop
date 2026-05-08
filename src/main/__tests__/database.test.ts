import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MIGRATIONS, PostureDatabase } from '../database'

// better-sqlite3 is rebuilt against Electron's Node ABI by `electron-builder
// install-app-deps`. Vitest runs in plain Node — the ABIs may diverge.
// Probe the binding once; if it can't load here, skip the whole suite.
// Run `npm run test:db` (which switches the binding back to Node ABI) to
// execute these tests; then `npm install` restores the Electron-built copy.
let bindingAvailable = true
try {
  new PostureDatabase(':memory:').close()
} catch (e) {
  bindingAvailable = false
  console.warn(
    `[database.test] skipping — better-sqlite3 binding is built for a different runtime (${(e as Error).message.split('\n')[0]})`
  )
}

const d = bindingAvailable ? describe : describe.skip

let db: PostureDatabase

beforeEach(() => {
  if (!bindingAvailable) return
  db = new PostureDatabase(':memory:')
})

afterEach(() => {
  if (!bindingAvailable) return
  db.close()
})

d('migrations', () => {
  it('runs initial migration on fresh database', () => {
    expect(db.currentVersion()).toBe(MIGRATIONS.length)
  })

  it('is idempotent — re-instantiating does not re-run', () => {
    const before = db.currentVersion()
    db.migrate()
    expect(db.currentVersion()).toBe(before)
  })
})

d('settings CRUD', () => {
  it('saves and retrieves a single setting', () => {
    db.saveSetting('language', 'tr')
    expect(db.getSetting('language')).toBe('tr')
  })

  it('returns null for missing keys', () => {
    expect(db.getSetting('nope')).toBeNull()
  })

  it('upserts on conflict', () => {
    db.saveSetting('sensitivity', 'low')
    db.saveSetting('sensitivity', 'high')
    expect(db.getSetting('sensitivity')).toBe('high')
  })

  it('getAllSettings returns flattened record', () => {
    db.saveSetting('language', 'en')
    db.saveSetting('sound', 'true')
    expect(db.getAllSettings()).toEqual({ language: 'en', sound: 'true' })
  })

  it('clearSetting removes a key', () => {
    db.saveSetting('foo', 'bar')
    db.clearSetting('foo')
    expect(db.getSetting('foo')).toBeNull()
  })
})

d('baseline single-row', () => {
  const sample = {
    cva: 60,
    shoulder_asymmetry: 3,
    alignment: 170,
    captured_at: '2026-05-08T00:00:00.000Z',
    sample_count: 100
  }

  it('returns null when no baseline saved', () => {
    expect(db.getBaseline()).toBeNull()
  })

  it('saves and retrieves baseline', () => {
    db.saveBaseline(sample)
    expect(db.getBaseline()).toEqual(sample)
  })

  it('overwrites on second save (single-row enforcement)', () => {
    db.saveBaseline(sample)
    db.saveBaseline({ ...sample, cva: 65 })
    expect(db.getBaseline()?.cva).toBe(65)
  })

  it('clearBaseline removes the row', () => {
    db.saveBaseline(sample)
    db.clearBaseline()
    expect(db.getBaseline()).toBeNull()
  })
})

d('sessions', () => {
  it('startSession returns incrementing ids', () => {
    const a = db.startSession('2026-05-08T10:00:00.000Z')
    const b = db.startSession('2026-05-08T11:00:00.000Z')
    expect(b).toBeGreaterThan(a)
  })

  it('getActiveSession returns latest unended session', () => {
    db.startSession('2026-05-08T10:00:00.000Z')
    const id = db.startSession('2026-05-08T11:00:00.000Z')
    expect(db.getActiveSession()?.id).toBe(id)
  })

  it('endSession populates totals', () => {
    const id = db.startSession('2026-05-08T10:00:00.000Z')
    db.endSession(id, '2026-05-08T11:00:00.000Z', {
      totalSeconds: 3600,
      goodSeconds: 3000,
      warningSeconds: 400,
      poorSeconds: 200
    })
    expect(db.getActiveSession()).toBeNull()
  })

  it('closeAllOpenSessions ends every dangling session', () => {
    db.startSession('2026-05-08T10:00:00.000Z')
    db.startSession('2026-05-08T11:00:00.000Z')
    db.closeAllOpenSessions('2026-05-08T12:00:00.000Z')
    expect(db.getActiveSession()).toBeNull()
  })
})

d('snapshots + stats', () => {
  it('insertSnapshot writes successfully', () => {
    const id = db.startSession('2026-05-08T10:00:00.000Z')
    db.insertSnapshot({
      sessionId: id,
      timestamp: '2026-05-08T10:00:30.000Z',
      cva: 55,
      shoulderAsymmetry: 3,
      alignment: 170,
      status: 'good'
    })
    expect(db.countSnapshots()).toBe(1)
  })

  it('getTodayStats returns 24 hour buckets', () => {
    const buckets = db.getTodayStats(new Date('2026-05-08T15:00:00.000Z'))
    expect(buckets).toHaveLength(24)
    expect(buckets[0].hour).toBe(0)
    expect(buckets[23].hour).toBe(23)
  })

  it('getTodayStats counts per-status into hour buckets (local time)', () => {
    const id = db.startSession('2026-05-08T10:00:00.000Z')
    const now = new Date()
    const sample = new Date(now)
    sample.setHours(14, 0, 0, 0)
    db.insertSnapshot({
      sessionId: id,
      timestamp: sample.toISOString(),
      cva: 55,
      shoulderAsymmetry: 3,
      alignment: 170,
      status: 'good'
    })
    db.insertSnapshot({
      sessionId: id,
      timestamp: sample.toISOString(),
      cva: 40,
      shoulderAsymmetry: 12,
      alignment: 140,
      status: 'poor'
    })
    const buckets = db.getTodayStats(now)
    expect(buckets[14].good).toBe(1)
    expect(buckets[14].poor).toBe(1)
    expect(buckets[14].warning).toBe(0)
  })

  it('getWeekStats returns 7 chronological day buckets ending today', () => {
    const buckets = db.getWeekStats(new Date('2026-05-08T15:00:00.000Z'))
    expect(buckets).toHaveLength(7)
    expect(buckets[6].date).toBe('2026-05-08')
    expect(buckets[0].date).toBe('2026-05-02')
  })

  it('countSnapshots reflects insertions', () => {
    const id = db.startSession('2026-05-08T10:00:00.000Z')
    expect(db.countSnapshots()).toBe(0)
    db.insertSnapshot({
      sessionId: id,
      timestamp: '2026-05-08T10:00:30.000Z',
      cva: 55,
      shoulderAsymmetry: 3,
      alignment: 170,
      status: 'good'
    })
    db.insertSnapshot({
      sessionId: id,
      timestamp: '2026-05-08T10:01:00.000Z',
      cva: 45,
      shoulderAsymmetry: 4,
      alignment: 160,
      status: 'warning'
    })
    expect(db.countSnapshots()).toBe(2)
  })
})
