import { describe, expect, it } from 'vitest'
import {
  CLINICAL_THRESHOLDS,
  classifyAgainstClinical,
  classifyAlignmentClinical,
  classifyAsymmetryClinical,
  classifyCvaClinical,
  worstStatus
} from '../clinical-thresholds'
import type { PostureMetrics } from '../types'

function metrics(cva: number, asym: number, align: number): PostureMetrics {
  return { cva, shoulderAsymmetry: asym, alignment: align, side: 'left' }
}

describe('classifyCvaClinical', () => {
  it('60° → good (well above healthy threshold)', () => {
    expect(classifyCvaClinical(60)).toBe('good')
  })

  it('50° → good (boundary inclusive)', () => {
    expect(classifyCvaClinical(50)).toBe('good')
  })

  it('47° → warning (between poor and healthy thresholds)', () => {
    expect(classifyCvaClinical(47)).toBe('warning')
  })

  it('45° → warning (boundary inclusive)', () => {
    expect(classifyCvaClinical(45)).toBe('warning')
  })

  it('42° → poor (below clinical safe range)', () => {
    expect(classifyCvaClinical(42)).toBe('poor')
  })

  it('uses thresholds from CLINICAL_THRESHOLDS', () => {
    expect(CLINICAL_THRESHOLDS.cva.healthy).toBe(50)
    expect(CLINICAL_THRESHOLDS.cva.warning).toBe(45)
    expect(CLINICAL_THRESHOLDS.cva.poor).toBe(45)
  })
})

describe('classifyAsymmetryClinical', () => {
  it('3% → good', () => {
    expect(classifyAsymmetryClinical(3)).toBe('good')
  })

  it('7% → warning', () => {
    expect(classifyAsymmetryClinical(7)).toBe('warning')
  })

  it('5% → warning (boundary inclusive)', () => {
    expect(classifyAsymmetryClinical(5)).toBe('warning')
  })

  it('8% → warning (upper boundary inclusive)', () => {
    expect(classifyAsymmetryClinical(8)).toBe('warning')
  })

  it('10% → poor', () => {
    expect(classifyAsymmetryClinical(10)).toBe('poor')
  })

  it('0% → good', () => {
    expect(classifyAsymmetryClinical(0)).toBe('good')
  })
})

describe('classifyAlignmentClinical', () => {
  it('170° → good', () => {
    expect(classifyAlignmentClinical(170)).toBe('good')
  })

  it('165° → good (boundary inclusive)', () => {
    expect(classifyAlignmentClinical(165)).toBe('good')
  })

  it('160° → warning', () => {
    expect(classifyAlignmentClinical(160)).toBe('warning')
  })

  it('155° → warning (boundary inclusive)', () => {
    expect(classifyAlignmentClinical(155)).toBe('warning')
  })

  it('150° → poor (below clinical safe range)', () => {
    expect(classifyAlignmentClinical(150)).toBe('poor')
  })
})

describe('worstStatus', () => {
  it('returns good when all good', () => {
    expect(worstStatus('good', 'good', 'good')).toBe('good')
  })

  it('escalates to warning when any warning is present', () => {
    expect(worstStatus('good', 'warning', 'good')).toBe('warning')
  })

  it('escalates to poor when any poor is present', () => {
    expect(worstStatus('good', 'warning', 'poor')).toBe('poor')
  })

  it('returns good when given no statuses', () => {
    expect(worstStatus()).toBe('good')
  })
})

describe('classifyAgainstClinical', () => {
  it('returns good when all metrics are healthy', () => {
    const result = classifyAgainstClinical(metrics(60, 3, 170))
    expect(result.status).toBe('good')
    expect(result.per).toEqual({ cva: 'good', shoulderAsymmetry: 'good', alignment: 'good' })
    expect(result.worstMetric).toBeNull()
  })

  it('flags poor when CVA breaches clinical threshold', () => {
    const result = classifyAgainstClinical(metrics(42, 3, 170))
    expect(result.status).toBe('poor')
    expect(result.per.cva).toBe('poor')
    expect(result.worstMetric).toBe('cva')
  })

  it('flags warning when single metric in warning band', () => {
    const result = classifyAgainstClinical(metrics(60, 6, 170))
    expect(result.status).toBe('warning')
    expect(result.worstMetric).toBe('shoulderAsymmetry')
  })

  it('reports the worst-ranked metric when multiple are problematic', () => {
    const result = classifyAgainstClinical(metrics(46, 10, 150))
    expect(result.status).toBe('poor')
    expect(result.per).toEqual({
      cva: 'warning',
      shoulderAsymmetry: 'poor',
      alignment: 'poor'
    })
    expect(result.worstMetric).toBe('shoulderAsymmetry')
  })

  it('worstMetric null when all good', () => {
    const result = classifyAgainstClinical(metrics(70, 1, 175))
    expect(result.worstMetric).toBeNull()
  })
})
