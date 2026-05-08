import { describe, expect, it } from 'vitest'
import { resolveDetail } from '../resolveDetail'
import { classifyHybrid } from '@/posture/hybrid-classifier'
import type { BaselineProfile } from '@/posture/calibration'

const dictionary: Record<string, string> = {
  'status.details.good': 'Good posture',
  'status.details.personalWarning': 'Slight deviation from baseline',
  'status.details.personalPoor': 'Significant deviation from baseline',
  'status.details.clinicalWarning': 'Approaching clinical threshold ({{metric}}: {{value}})',
  'status.details.clinicalPoor':
    'Below clinical safe range ({{metric}}: {{value}} {{op}} {{cutoff}})',
  'status.details.both': '{{clinical}} — and {{personal}}',
  'status.details.noBaseline': 'Within healthy range (no baseline yet)',
  'status.metric.cva': 'CVA',
  'status.metric.asymmetry': 'asymmetry',
  'status.metric.alignment': 'alignment'
}

const t = (key: string, values?: Record<string, unknown>): string => {
  let template = dictionary[key] ?? key
  if (values) {
    for (const [k, v] of Object.entries(values)) {
      template = template.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
    }
  }
  return template
}

const healthyBaseline: BaselineProfile = {
  cva: 60,
  shoulderAsymmetry: 3,
  alignment: 170,
  capturedAt: '2026-05-08T00:00:00.000Z',
  sampleCount: 100
}

describe('resolveDetail', () => {
  it('renders good descriptor', () => {
    expect(resolveDetail(t, { key: 'status.details.good' })).toBe('Good posture')
  })

  it('renders clinical warning with interpolated metric + value', () => {
    const c = classifyHybrid(
      { cva: 47, shoulderAsymmetry: 3, alignment: 170, side: 'left' },
      { baseline: healthyBaseline, sensitivity: 'high', useClinicalLayer: true }
    )
    expect(c.reason).toBe('clinical')
    expect(resolveDetail(t, c.detail)).toBe('Approaching clinical threshold (CVA: 47°)')
  })

  it('renders personal warning', () => {
    const c = classifyHybrid(
      { cva: 50, shoulderAsymmetry: 3, alignment: 170, side: 'left' },
      { baseline: healthyBaseline, sensitivity: 'medium', useClinicalLayer: true }
    )
    expect(c.reason).toBe('personal')
    expect(resolveDetail(t, c.detail)).toBe('Slight deviation from baseline')
  })

  it('renders BOTH case without infinite recursion', () => {
    const c = classifyHybrid(
      { cva: 40, shoulderAsymmetry: 3, alignment: 170, side: 'left' },
      { baseline: healthyBaseline, sensitivity: 'medium', useClinicalLayer: true }
    )
    expect(c.reason).toBe('both')
    const out = resolveDetail(t, c.detail)
    expect(out).toContain('Below clinical safe range')
    expect(out).toContain('CVA')
    expect(out).toContain('40°')
    expect(out).toContain('< 45°')
    expect(out.toLowerCase()).toContain('significant deviation from baseline')
  })

  it('handles a hand-crafted both-descriptor with deeply nested keys without stack overflow', () => {
    const detail = {
      key: 'status.details.both',
      values: {
        metricKey: 'status.metric.cva',
        value: '40°',
        op: '<',
        cutoff: '45°',
        clinicalKey: 'status.details.clinicalPoor',
        personalKey: 'status.details.personalPoor'
      }
    }
    expect(() => resolveDetail(t, detail)).not.toThrow()
    expect(resolveDetail(t, detail)).toContain('Below clinical safe range')
  })
})
