import type { PostureMetrics, PostureStatus } from './types'
import {
  applyBaseline,
  classifyAgainstBaseline,
  TOLERANCES,
  type BaselineDeltas,
  type BaselineProfile,
  type SensitivityLevel
} from './calibration'
import {
  CLINICAL_METRIC_INFO,
  CLINICAL_THRESHOLDS,
  classifyAgainstClinical,
  worstStatus,
  type ClinicalBreakdown,
  type ClinicalMetric
} from './clinical-thresholds'

export type ClassificationReason = 'good' | 'clinical' | 'personal' | 'both' | 'no-baseline'

export interface DetailDescriptor {
  key: string
  values?: Record<string, string | number>
}

export interface PersonalLayer {
  status: PostureStatus
  detail: DetailDescriptor
  deltas: BaselineDeltas
}

export interface HybridClassification {
  status: PostureStatus
  reason: ClassificationReason
  detail: DetailDescriptor
  clinical: ClinicalBreakdown
  clinicalDetail: DetailDescriptor
  personal: PersonalLayer | null
}

export interface HybridOptions {
  baseline: BaselineProfile | null
  sensitivity: SensitivityLevel
  useClinicalLayer: boolean
}

const PERSONAL_KEY: Record<PostureStatus, string> = {
  good: 'status.details.good',
  warning: 'status.details.personalWarning',
  poor: 'status.details.personalPoor'
}

function metricLabelKey(metric: ClinicalMetric): string {
  return `status.metric.${metric === 'shoulderAsymmetry' ? 'asymmetry' : metric}`
}

function clinicalDetail(metrics: PostureMetrics, breakdown: ClinicalBreakdown): DetailDescriptor {
  if (breakdown.status === 'good') return { key: 'status.details.good' }
  const m = breakdown.worstMetric
  if (!m) return { key: 'status.details.good' }
  const info = CLINICAL_METRIC_INFO[m]
  const value = info.format(metrics[m])
  if (breakdown.status === 'warning') {
    return {
      key: 'status.details.clinicalWarning',
      values: { metricKey: metricLabelKey(m), value }
    }
  }
  const cutoff = `${CLINICAL_THRESHOLDS[m].poor}${info.unit}`
  return {
    key: 'status.details.clinicalPoor',
    values: {
      metricKey: metricLabelKey(m),
      value,
      op: m === 'shoulderAsymmetry' ? '>' : '<',
      cutoff
    }
  }
}

export function classifyHybrid(
  metrics: PostureMetrics,
  options: HybridOptions
): HybridClassification {
  const { baseline, sensitivity, useClinicalLayer } = options

  const clinical = classifyAgainstClinical(metrics)
  const clinicalStatus = useClinicalLayer ? clinical.status : 'good'
  const clinicalDescriptor = clinicalDetail(metrics, clinical)

  let personal: PersonalLayer | null = null
  if (baseline) {
    const personalStatus = classifyAgainstBaseline(
      metrics,
      baseline,
      TOLERANCES[sensitivity]
    )
    personal = {
      status: personalStatus,
      detail: { key: PERSONAL_KEY[personalStatus] },
      deltas: applyBaseline(metrics, baseline)
    }
  }

  const personalStatus: PostureStatus = personal?.status ?? 'good'
  const status = worstStatus(clinicalStatus, personalStatus)

  let reason: ClassificationReason
  if (!baseline) {
    reason = clinicalStatus === 'good' ? 'good' : 'clinical'
    if (!useClinicalLayer && !baseline) reason = 'no-baseline'
  } else if (clinicalStatus === 'good' && personalStatus === 'good') {
    reason = 'good'
  } else if (clinicalStatus !== 'good' && personalStatus !== 'good') {
    reason = 'both'
  } else if (clinicalStatus !== 'good') {
    reason = 'clinical'
  } else {
    reason = 'personal'
  }

  let detail: DetailDescriptor
  switch (reason) {
    case 'good':
      detail = { key: 'status.details.good' }
      break
    case 'clinical':
      detail = clinicalDescriptor
      break
    case 'personal':
      detail = personal?.detail ?? { key: 'status.details.personalWarning' }
      break
    case 'both':
      detail = {
        key: 'status.details.both',
        values: {
          clinicalKey: clinicalDescriptor.key,
          personalKey: personal?.detail.key ?? 'status.details.personalWarning'
        }
      }
      break
    case 'no-baseline':
      detail =
        clinical.status === 'good'
          ? { key: 'status.details.noBaseline' }
          : clinicalDescriptor
      break
  }

  return {
    status,
    reason,
    detail,
    clinical,
    clinicalDetail: clinicalDescriptor,
    personal
  }
}

export function isBaselineWithinClinicalHealthy(baseline: BaselineProfile): boolean {
  return (
    classifyAgainstClinical({
      cva: baseline.cva,
      shoulderAsymmetry: baseline.shoulderAsymmetry,
      alignment: baseline.alignment,
      side: 'left'
    }).status === 'good'
  )
}
