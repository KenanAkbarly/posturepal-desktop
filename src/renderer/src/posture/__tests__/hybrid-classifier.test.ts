import { describe, expect, it } from 'vitest'
import {
  classifyHybrid,
  isBaselineWithinClinicalHealthy,
  type HybridOptions
} from '../hybrid-classifier'
import type { BaselineProfile } from '../calibration'
import type { PostureMetrics } from '../types'

function metrics(cva: number, asym: number, align: number): PostureMetrics {
  return { cva, shoulderAsymmetry: asym, alignment: align, side: 'left' }
}

const healthyBaseline: BaselineProfile = {
  cva: 60,
  shoulderAsymmetry: 3,
  alignment: 170,
  capturedAt: '2026-05-08T00:00:00.000Z',
  sampleCount: 100
}

const slumpyBaseline: BaselineProfile = {
  cva: 42,
  shoulderAsymmetry: 9,
  alignment: 150,
  capturedAt: '2026-05-08T00:00:00.000Z',
  sampleCount: 100
}

function opts(over: Partial<HybridOptions> = {}): HybridOptions {
  return {
    baseline: null,
    sensitivity: 'medium',
    useClinicalLayer: true,
    ...over
  }
}

describe('classifyHybrid', () => {
  it('healthy baseline + sitting at baseline → good', () => {
    const result = classifyHybrid(metrics(60, 3, 170), opts({ baseline: healthyBaseline }))
    expect(result.status).toBe('good')
    expect(result.reason).toBe('good')
    expect(result.details).toMatch(/Good posture/i)
  })

  it('healthy baseline + slight deviation: personal warning, clinical good → warning by personal', () => {
    const result = classifyHybrid(metrics(50, 3, 170), opts({ baseline: healthyBaseline }))
    expect(result.status).toBe('warning')
    expect(result.reason).toBe('personal')
    expect(result.clinical.status).toBe('good')
    expect(result.personal?.status).toBe('warning')
    expect(result.details).toMatch(/Slight deviation from your baseline/i)
  })

  it('SAFETY NET: bad baseline + sitting same way → personal good, clinical poor → final POOR', () => {
    const result = classifyHybrid(metrics(42, 9, 150), opts({ baseline: slumpyBaseline }))
    expect(result.status).toBe('poor')
    expect(result.reason).toBe('clinical')
    expect(result.clinical.status).toBe('poor')
    expect(result.personal?.status).toBe('good')
    expect(result.details).toMatch(/Below clinical safe range/i)
  })

  it('healthy baseline + dropping into clinical poor → both poor', () => {
    const result = classifyHybrid(metrics(40, 3, 170), opts({ baseline: healthyBaseline }))
    expect(result.status).toBe('poor')
    expect(result.reason).toBe('both')
    expect(result.clinical.status).toBe('poor')
    expect(result.personal?.status).toBe('poor')
    expect(result.details.toLowerCase()).toContain('clinical')
    expect(result.details.toLowerCase()).toContain('baseline')
  })

  it('no baseline + clinically good metrics → good', () => {
    const result = classifyHybrid(metrics(60, 3, 170), opts({ baseline: null }))
    expect(result.status).toBe('good')
    expect(result.reason).toBe('good')
    expect(result.personal).toBeNull()
  })

  it('no baseline + clinically poor metrics → clinical poor', () => {
    const result = classifyHybrid(metrics(40, 3, 170), opts({ baseline: null }))
    expect(result.status).toBe('poor')
    expect(result.reason).toBe('clinical')
    expect(result.personal).toBeNull()
  })

  it('clinical layer disabled + bad baseline + same sitting → personal good (no safety net)', () => {
    const result = classifyHybrid(
      metrics(42, 9, 150),
      opts({ baseline: slumpyBaseline, useClinicalLayer: false })
    )
    expect(result.status).toBe('good')
    expect(result.reason).toBe('good')
    expect(result.clinical.status).toBe('poor')
  })

  it('exposes clinical breakdown including worst metric', () => {
    const result = classifyHybrid(metrics(46, 12, 170), opts({ baseline: healthyBaseline }))
    expect(result.clinical.per.shoulderAsymmetry).toBe('poor')
    expect(result.clinical.worstMetric).toBe('shoulderAsymmetry')
  })

  it('details are user-readable for clinical warning', () => {
    // Use high sensitivity so 21% personal deviation stays "good"; clinical alone fires.
    const result = classifyHybrid(
      metrics(47, 3, 170),
      opts({ baseline: healthyBaseline, sensitivity: 'high' })
    )
    expect(result.reason).toBe('clinical')
    expect(result.details).toMatch(/CVA/)
    expect(result.details).toMatch(/47/)
  })

  it('returns deltas in personal layer when baseline present', () => {
    const result = classifyHybrid(metrics(55, 4, 168), opts({ baseline: healthyBaseline }))
    expect(result.personal?.deltas.cvaDelta).toBeCloseTo(-5, 5)
    expect(result.personal?.deltas.asymmetryDelta).toBeCloseTo(1, 5)
    expect(result.personal?.deltas.alignmentDelta).toBeCloseTo(-2, 5)
  })

  it('worst-of rule: clinical warning + personal poor → poor', () => {
    // Baseline 70° makes a drop to 46° a 34% deviation → personal poor;
    // 46° also sits in clinical warning band (45-49). Combined: poor.
    const baseline: BaselineProfile = { ...healthyBaseline, cva: 70 }
    const result = classifyHybrid(metrics(46, 3, 170), opts({ baseline }))
    expect(result.clinical.status).toBe('warning')
    expect(result.personal?.status).toBe('poor')
    expect(result.status).toBe('poor')
    expect(result.reason).toBe('both')
  })
})

describe('isBaselineWithinClinicalHealthy', () => {
  it('returns true for a clinically healthy baseline', () => {
    expect(isBaselineWithinClinicalHealthy(healthyBaseline)).toBe(true)
  })

  it('returns false when baseline CVA is below clinical healthy', () => {
    expect(isBaselineWithinClinicalHealthy({ ...healthyBaseline, cva: 40 })).toBe(false)
  })

  it('returns false when baseline shoulder asymmetry is above clinical healthy', () => {
    expect(isBaselineWithinClinicalHealthy({ ...healthyBaseline, shoulderAsymmetry: 9 })).toBe(
      false
    )
  })

  it('returns false when baseline alignment is below clinical healthy', () => {
    expect(isBaselineWithinClinicalHealthy({ ...healthyBaseline, alignment: 150 })).toBe(false)
  })

  it('returns false even for warning-band baseline (not strictly healthy)', () => {
    expect(isBaselineWithinClinicalHealthy({ ...healthyBaseline, cva: 47 })).toBe(false)
  })
})
