import { describe, expect, it } from 'vitest'
import {
  BaselineAccumulator,
  applyBaseline,
  classifyAgainstBaseline,
  deviationFraction,
  TOLERANCES,
  type BaselineProfile
} from '../calibration'
import type { PostureMetrics } from '../types'

function metrics(cva: number, asym: number, align: number): PostureMetrics {
  return { cva, shoulderAsymmetry: asym, alignment: align, side: 'left' }
}

const baseline: BaselineProfile = {
  cva: 60,
  shoulderAsymmetry: 3,
  alignment: 170,
  capturedAt: '2026-05-07T00:00:00.000Z',
  sampleCount: 100
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
    const deltas = applyBaseline(metrics(50, 5, 165), baseline)
    expect(deltas.cvaDelta).toBe(-10)
    expect(deltas.asymmetryDelta).toBe(2)
    expect(deltas.alignmentDelta).toBe(-5)
  })

  it('returns zero deltas when current matches baseline', () => {
    const deltas = applyBaseline(metrics(60, 3, 170), baseline)
    expect(deltas.cvaDelta).toBe(0)
    expect(deltas.asymmetryDelta).toBe(0)
    expect(deltas.alignmentDelta).toBe(0)
  })

  it('returns positive cvaDelta when posture improves above baseline', () => {
    const deltas = applyBaseline(metrics(75, 3, 170), baseline)
    expect(deltas.cvaDelta).toBe(15)
  })
})

describe('deviationFraction', () => {
  it('returns 0 for cva when current >= baseline (no drop)', () => {
    expect(deviationFraction('cva', 65, 60)).toBe(0)
    expect(deviationFraction('cva', 60, 60)).toBe(0)
  })

  it('cva deviation: 10% drop reads as 0.10', () => {
    expect(deviationFraction('cva', 54, 60)).toBeCloseTo(0.1, 5)
  })

  it('alignment deviation: 10% drop reads as 0.10', () => {
    expect(deviationFraction('alignment', 153, 170)).toBeCloseTo(0.1, 5)
  })

  it('shoulderAsymmetry: increase from 3pp to 13pp reads as 0.10', () => {
    expect(deviationFraction('shoulderAsymmetry', 13, 3)).toBeCloseTo(0.1, 5)
  })

  it('shoulderAsymmetry: decrease (better) reads as 0', () => {
    expect(deviationFraction('shoulderAsymmetry', 1, 3)).toBe(0)
  })

  it('cva: returns 0 safely when baseline is non-positive', () => {
    expect(deviationFraction('cva', 50, 0)).toBe(0)
    expect(deviationFraction('cva', 50, -5)).toBe(0)
  })
})

describe('classifyAgainstBaseline', () => {
  it('returns good when current matches baseline', () => {
    expect(classifyAgainstBaseline(metrics(60, 3, 170), baseline, TOLERANCES.medium)).toBe('good')
  })

  it('Low tolerance: 10% CVA drop triggers warning', () => {
    expect(classifyAgainstBaseline(metrics(54, 3, 170), baseline, TOLERANCES.low)).toBe('warning')
  })

  it('Low tolerance: 20% CVA drop triggers poor', () => {
    expect(classifyAgainstBaseline(metrics(48, 3, 170), baseline, TOLERANCES.low)).toBe('poor')
  })

  it('Medium tolerance: 10% CVA drop is still good', () => {
    expect(classifyAgainstBaseline(metrics(54, 3, 170), baseline, TOLERANCES.medium)).toBe('good')
  })

  it('High tolerance: 20% CVA drop is still good', () => {
    expect(classifyAgainstBaseline(metrics(48, 3, 170), baseline, TOLERANCES.high)).toBe('good')
  })

  it('asymmetry deviation triggers status independently', () => {
    expect(classifyAgainstBaseline(metrics(60, 18, 170), baseline, TOLERANCES.medium)).toBe(
      'warning'
    )
    expect(classifyAgainstBaseline(metrics(60, 35, 170), baseline, TOLERANCES.medium)).toBe('poor')
  })

  it('uses worst metric across the three', () => {
    const m = metrics(60, 3, 119)
    expect(classifyAgainstBaseline(m, baseline, TOLERANCES.medium)).toBe('poor')
  })

  it('different users with different baselines get personalized verdicts', () => {
    const slumpyBaseline: BaselineProfile = { ...baseline, cva: 40 }
    const verdictForSlumpyUser = classifyAgainstBaseline(
      metrics(40, 3, 170),
      slumpyBaseline,
      TOLERANCES.medium
    )
    expect(verdictForSlumpyUser).toBe('good')
    const verdictForUprightUser = classifyAgainstBaseline(
      metrics(40, 3, 170),
      baseline,
      TOLERANCES.medium
    )
    expect(verdictForUprightUser).toBe('poor')
  })
})
