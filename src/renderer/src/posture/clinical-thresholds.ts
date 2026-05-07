import type { PostureMetrics, PostureStatus } from './types'

/**
 * Clinical absolute thresholds — independent of any individual user's
 * baseline. These define a research-backed envelope of healthy posture.
 *
 * Sources:
 *  - CVA: Kim D, Lee H, Park K (2024b). Real-time forward head posture
 *    detection. Applied Sciences, 14(7), 2965. — 48° threshold; we add
 *    a 2° margin so warning starts at 45° (poor at <45°).
 *  - Shoulder asymmetry: Cortes et al. (2024). Sitting posture
 *    recognition systems — shoulder-width-normalized.
 *  - Ear-shoulder-hip alignment: Moreira et al. (2022). A computer
 *    vision-based mobile tool — 155-165° deviation band.
 */
export const CLINICAL_THRESHOLDS = {
  cva: { healthy: 50, warning: 45, poor: 45 },
  shoulderAsymmetry: { healthy: 5, warning: 8, poor: 8 },
  alignment: { healthy: 165, warning: 155, poor: 155 }
} as const

export type ClinicalMetric = keyof typeof CLINICAL_THRESHOLDS

export function classifyCvaClinical(value: number): PostureStatus {
  if (value < CLINICAL_THRESHOLDS.cva.poor) return 'poor'
  if (value < CLINICAL_THRESHOLDS.cva.healthy) return 'warning'
  return 'good'
}

export function classifyAlignmentClinical(value: number): PostureStatus {
  if (value < CLINICAL_THRESHOLDS.alignment.poor) return 'poor'
  if (value < CLINICAL_THRESHOLDS.alignment.healthy) return 'warning'
  return 'good'
}

export function classifyAsymmetryClinical(value: number): PostureStatus {
  if (value > CLINICAL_THRESHOLDS.shoulderAsymmetry.poor) return 'poor'
  if (value >= CLINICAL_THRESHOLDS.shoulderAsymmetry.healthy) return 'warning'
  return 'good'
}

const STATUS_RANK: Record<PostureStatus, number> = { good: 0, warning: 1, poor: 2 }

export function worstStatus(...statuses: PostureStatus[]): PostureStatus {
  let worst: PostureStatus = 'good'
  for (const s of statuses) {
    if (STATUS_RANK[s] > STATUS_RANK[worst]) worst = s
  }
  return worst
}

export interface ClinicalBreakdown {
  status: PostureStatus
  per: Record<ClinicalMetric, PostureStatus>
  worstMetric: ClinicalMetric | null
}

export function classifyAgainstClinical(metrics: PostureMetrics): ClinicalBreakdown {
  const per: Record<ClinicalMetric, PostureStatus> = {
    cva: classifyCvaClinical(metrics.cva),
    shoulderAsymmetry: classifyAsymmetryClinical(metrics.shoulderAsymmetry),
    alignment: classifyAlignmentClinical(metrics.alignment)
  }
  const status = worstStatus(per.cva, per.shoulderAsymmetry, per.alignment)
  let worstMetric: ClinicalMetric | null = null
  if (status !== 'good') {
    const ordered: ClinicalMetric[] = ['cva', 'shoulderAsymmetry', 'alignment']
    worstMetric =
      ordered.find((m) => per[m] === status) ?? null
  }
  return { status, per, worstMetric }
}

export interface MetricDescriptor {
  display: string
  unit: string
  format: (value: number) => string
}

export const CLINICAL_METRIC_INFO: Record<ClinicalMetric, MetricDescriptor> = {
  cva: { display: 'CVA', unit: '°', format: (v) => `${v.toFixed(0)}°` },
  shoulderAsymmetry: {
    display: 'asymmetry',
    unit: '%',
    format: (v) => `${v.toFixed(1)}%`
  },
  alignment: { display: 'alignment', unit: '°', format: (v) => `${v.toFixed(0)}°` }
}
