import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'
import type { Database as DB } from 'better-sqlite3'

export interface BaselineRecord {
  cva: number
  shoulder_asymmetry: number
  alignment: number
  captured_at: string
  sample_count: number
}

export interface SnapshotInput {
  sessionId: number
  timestamp: string
  cva: number | null
  shoulderAsymmetry: number | null
  alignment: number | null
  status: 'good' | 'warning' | 'poor'
}

export interface SessionTotals {
  totalSeconds: number
  goodSeconds: number
  warningSeconds: number
  poorSeconds: number
}

export interface SessionRow {
  id: number
  started_at: string
  ended_at: string | null
  total_duration_seconds: number
  good_seconds: number
  warning_seconds: number
  poor_seconds: number
}

export interface HourBucket {
  hour: number
  good: number
  warning: number
  poor: number
}

export interface DayBucket {
  date: string
  good: number
  warning: number
  poor: number
}

function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const MIGRATIONS: string[] = [
  // v1 — initial schema
  `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS baseline (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    cva REAL NOT NULL,
    shoulder_asymmetry REAL NOT NULL,
    alignment REAL NOT NULL,
    captured_at TEXT NOT NULL,
    sample_count INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    total_duration_seconds INTEGER DEFAULT 0,
    good_seconds INTEGER DEFAULT 0,
    warning_seconds INTEGER DEFAULT 0,
    poor_seconds INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS posture_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    cva REAL,
    shoulder_asymmetry REAL,
    alignment REAL,
    status TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );
  CREATE INDEX IF NOT EXISTS idx_snapshots_session ON posture_snapshots(session_id);
  CREATE INDEX IF NOT EXISTS idx_snapshots_timestamp ON posture_snapshots(timestamp);
  `
]

export class PostureDatabase {
  private db: DB

  constructor(filePath: string) {
    if (filePath !== ':memory:') {
      mkdirSync(dirname(filePath), { recursive: true })
    }
    this.db = new Database(filePath)
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('foreign_keys = ON')
    this.migrate()
  }

  migrate(): void {
    this.db.exec(`CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY)`)
    const current = this.currentVersion()
    for (let i = current; i < MIGRATIONS.length; i++) {
      this.db.exec(MIGRATIONS[i])
      this.db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(i + 1)
    }
  }

  currentVersion(): number {
    const row = this.db
      .prepare('SELECT MAX(version) AS v FROM schema_version')
      .get() as { v: number | null }
    return row?.v ?? 0
  }

  // --- settings (key/value) ---

  getAllSettings(): Record<string, string> {
    const rows = this.db.prepare('SELECT key, value FROM settings').all() as Array<{
      key: string
      value: string
    }>
    return Object.fromEntries(rows.map((r) => [r.key, r.value]))
  }

  getSetting(key: string): string | null {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
      | { value: string }
      | undefined
    return row?.value ?? null
  }

  saveSetting(key: string, value: string): void {
    this.db
      .prepare(
        `INSERT INTO settings (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`
      )
      .run(key, value)
  }

  clearSetting(key: string): void {
    this.db.prepare('DELETE FROM settings WHERE key = ?').run(key)
  }

  // --- baseline (single row, id=1) ---

  getBaseline(): BaselineRecord | null {
    const row = this.db
      .prepare(
        'SELECT cva, shoulder_asymmetry, alignment, captured_at, sample_count FROM baseline WHERE id = 1'
      )
      .get() as BaselineRecord | undefined
    return row ?? null
  }

  saveBaseline(record: BaselineRecord): void {
    this.db
      .prepare(
        `INSERT INTO baseline (id, cva, shoulder_asymmetry, alignment, captured_at, sample_count)
         VALUES (1, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           cva = excluded.cva,
           shoulder_asymmetry = excluded.shoulder_asymmetry,
           alignment = excluded.alignment,
           captured_at = excluded.captured_at,
           sample_count = excluded.sample_count`
      )
      .run(
        record.cva,
        record.shoulder_asymmetry,
        record.alignment,
        record.captured_at,
        record.sample_count
      )
  }

  clearBaseline(): void {
    this.db.prepare('DELETE FROM baseline WHERE id = 1').run()
  }

  // --- sessions ---

  startSession(startedAt: string): number {
    const result = this.db
      .prepare('INSERT INTO sessions (started_at) VALUES (?)')
      .run(startedAt)
    return Number(result.lastInsertRowid)
  }

  endSession(id: number, endedAt: string, totals: SessionTotals): void {
    this.db
      .prepare(
        `UPDATE sessions SET
           ended_at = ?,
           total_duration_seconds = ?,
           good_seconds = ?,
           warning_seconds = ?,
           poor_seconds = ?
         WHERE id = ?`
      )
      .run(
        endedAt,
        totals.totalSeconds,
        totals.goodSeconds,
        totals.warningSeconds,
        totals.poorSeconds,
        id
      )
  }

  getActiveSession(): SessionRow | null {
    const row = this.db
      .prepare('SELECT * FROM sessions WHERE ended_at IS NULL ORDER BY id DESC LIMIT 1')
      .get() as SessionRow | undefined
    return row ?? null
  }

  closeAllOpenSessions(endedAt: string): void {
    this.db
      .prepare('UPDATE sessions SET ended_at = ? WHERE ended_at IS NULL')
      .run(endedAt)
  }

  // --- snapshots ---

  insertSnapshot(s: SnapshotInput): void {
    this.db
      .prepare(
        `INSERT INTO posture_snapshots
           (session_id, timestamp, cva, shoulder_asymmetry, alignment, status)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(s.sessionId, s.timestamp, s.cva, s.shoulderAsymmetry, s.alignment, s.status)
  }

  // --- stats ---

  /**
   * Returns 24 buckets keyed by hour-of-day in local time. Each bucket counts
   * snapshots whose status was good/warning/poor; consumer multiplies by
   * SNAPSHOT_INTERVAL to get seconds.
   */
  getTodayStats(now: Date = new Date()): HourBucket[] {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    const rows = this.db
      .prepare(
        `SELECT timestamp, status FROM posture_snapshots
         WHERE timestamp >= ? AND timestamp <= ?`
      )
      .all(start.toISOString(), end.toISOString()) as Array<{
      timestamp: string
      status: 'good' | 'warning' | 'poor'
    }>

    const buckets: HourBucket[] = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      good: 0,
      warning: 0,
      poor: 0
    }))
    for (const r of rows) {
      const d = new Date(r.timestamp)
      const h = d.getHours()
      buckets[h][r.status] += 1
    }
    return buckets
  }

  /**
   * Returns 7 daily buckets ending today, in chronological order
   * (index 0 = oldest). Each bucket counts snapshots per status.
   * Day boundaries are local time, formatted as YYYY-MM-DD.
   */
  getWeekStats(now: Date = new Date()): DayBucket[] {
    const days: DayBucket[] = []
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - 6)

    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push({ date: localDateKey(d), good: 0, warning: 0, poor: 0 })
    }

    const rangeStart = start.toISOString()
    const rangeEnd = new Date(now)
    rangeEnd.setHours(23, 59, 59, 999)

    const rows = this.db
      .prepare(
        `SELECT timestamp, status FROM posture_snapshots
         WHERE timestamp >= ? AND timestamp <= ?`
      )
      .all(rangeStart, rangeEnd.toISOString()) as Array<{
      timestamp: string
      status: 'good' | 'warning' | 'poor'
    }>

    for (const r of rows) {
      const key = localDateKey(new Date(r.timestamp))
      const bucket = days.find((b) => b.date === key)
      if (bucket) bucket[r.status] += 1
    }
    return days
  }

  countSnapshots(): number {
    const row = this.db
      .prepare('SELECT COUNT(*) AS c FROM posture_snapshots')
      .get() as { c: number }
    return row.c
  }

  close(): void {
    this.db.close()
  }
}
