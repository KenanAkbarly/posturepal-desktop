import { describe, expect, it } from 'vitest'
import { BaselineAccumulator, applyBaseline } from '../calibration'
import type { PostureMetrics } from '../types'

function metrics(cva: number, asym: number, align: number): PostureMetrics {
  return { cva, shoulderAsymmetry: asym, alignment: align, side: 'left' }
}

describe('BaselineAccumulator', () => {
  it('returns null when no samples', () => {
    const acc = new BaselineAccumulator()
    expect(acc.result()).toBeNull()
  })

  it('averages samples correctly', () => {
    const acc = new BaselineAccumulator()
    acc.add(metrics(50, 2, 170))
    acc.add(metrics(60, 4, 175))
    acc.add(metrics(55, 3, 172))
    const r = acc.result()!
    expect(r.cva).toBeCloseTo(55, 5)
    expect(r.shoulderAsymmetry).toBeCloseTo(3, 5)
    expect(r.alignment).toBeCloseTo(172.333, 2)
    expect(r.sampleCount).toBe(3)
    expect(typeof r.capturedAt).toBe('string')
  })

  it('reset clears samples', () => {
    const acc = new BaselineAccumulator()
    acc.add(metrics(50, 2, 170))
    acc.reset()
    expect(acc.size()).toBe(0)
    expect(acc.result()).toBeNull()
  })
})

describe('applyBaseline', () => {
  it('returns deltas relative to baseline', () => {
    const baseline = {
      cva: 55,
      shoulderAsymmetry: 3,
      alignment: 170,
      capturedAt: '2026-05-07T00:00:00.000Z',
      sampleCount: 100
    }
    const deltas = applyBaseline(metrics(50, 5, 165), baseline)
    expect(deltas.cvaDelta).toBe(-5)
    expect(deltas.asymmetryDelta).toBe(2)
    expect(deltas.alignmentDelta).toBe(-5)
  })
})
