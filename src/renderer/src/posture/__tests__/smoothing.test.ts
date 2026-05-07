import { beforeEach, describe, expect, it } from 'vitest'
import { Hysteresis, SlidingWindow } from '../smoothing'

describe('SlidingWindow', () => {
  it('returns 0 when empty', () => {
    const w = new SlidingWindow(3)
    expect(w.average()).toBe(0)
    expect(w.size()).toBe(0)
  })

  it('averages values and respects max size', () => {
    const w = new SlidingWindow(3)
    w.push(10)
    w.push(20)
    w.push(30)
    expect(w.average()).toBe(20)
    w.push(40)
    expect(w.size()).toBe(3)
    expect(w.average()).toBe(30)
  })

  it('clear resets state', () => {
    const w = new SlidingWindow(3)
    w.push(10)
    w.clear()
    expect(w.size()).toBe(0)
    expect(w.average()).toBe(0)
  })
})

describe('Hysteresis', () => {
  let now = 0
  const clock = (): number => now
  beforeEach(() => {
    now = 0
  })

  it('stays in initial state when observation matches', () => {
    const h = new Hysteresis({ confirmMs: 5000, now: clock }, 'good')
    expect(h.feed('good')).toBe('good')
    now = 10000
    expect(h.feed('good')).toBe('good')
  })

  it('does not transition before confirmation window elapses', () => {
    const h = new Hysteresis({ confirmMs: 5000, now: clock }, 'good')
    now = 0
    expect(h.feed('poor')).toBe('good')
    now = 3000
    expect(h.feed('poor')).toBe('good')
  })

  it('transitions once confirmation window elapses', () => {
    const h = new Hysteresis({ confirmMs: 5000, now: clock }, 'good')
    now = 0
    h.feed('poor')
    now = 5500
    expect(h.feed('poor')).toBe('poor')
  })

  it('resets candidate when observation flips back to current state', () => {
    const h = new Hysteresis({ confirmMs: 5000, now: clock }, 'good')
    now = 0
    h.feed('poor')
    now = 2000
    expect(h.feed('good')).toBe('good')
    now = 4000
    expect(h.feed('poor')).toBe('good')
    now = 8000
    expect(h.feed('poor')).toBe('good')
    now = 9001
    expect(h.feed('poor')).toBe('poor')
  })

  it('reset() restores given state', () => {
    const h = new Hysteresis({ confirmMs: 1000, now: clock }, 'good')
    now = 0
    h.feed('poor')
    now = 2000
    h.feed('poor')
    expect(h.status()).toBe('poor')
    h.reset('warning')
    expect(h.status()).toBe('warning')
  })
})
