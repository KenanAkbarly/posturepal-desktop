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

export interface PersonalLayer {
  status: PostureStatus
  details: string
  deltas: BaselineDeltas
}

export interface HybridClassification {
  status: PostureStatus
  reason: ClassificationReason
  details: string
  clinical: ClinicalBreakdown
  personal: PersonalLayer | null
}

export interface HybridOptions {
  baseline: BaselineProfile | null
  sensitivity: SensitivityLevel
  useClinicalLayer: boolean
}

const PERSONAL_LABEL: Record<PostureStatus, string> = {
  good: 'Within your typical range',
  warning: 'Slight deviation from your baseline',
  poor: 'Significant deviation from your baseline'
}

function clinicalDetail(metrics: PostureMetrics, breakdown: ClinicalBreakdown): string {
  if (breakdown.status === 'good') return 'Within healthy range'
  const m = breakdown.worstMetric
  if (!m) return 'Within healthy range'
  const info = CLINICAL_METRIC_INFO[m]
  const value = info.format(metrics[m])
  if (breakdown.status === 'warning') {
    return `Approaching clinical threshold (${info.display}: ${value})`
  }
  const cutoff = clinicalCutoff(m)
  return `Below clinical safe range (${info.display}: ${value} ${cutoffComparator(m)} ${cutoff})`
}

function clinicalCutoff(metric: ClinicalMetric): string {
  const t = CLINICAL_THRESHOLDS[metric]
  const info = CLINICAL_METRIC_INFO[metric]
  return `${t.poor}${info.unit}`
}

function cutoffComparator(metric: ClinicalMetric): string {
  return metric === 'shoulderAsymmetry' ? '>' : '<'
}

function combineDetails(
  reason: ClassificationReason,
  clinical: ClinicalBreakdown,
  personal: PersonalLayer | null,
  metrics: PostureMetrics
): string {
  switch (reason) {
    case 'good':
      return 'Good posture (within healthy range)'
    case 'clinical':
      return clinicalDetail(metrics, clinical)
    case 'personal':
      return personal ? PERSONAL_LABEL[personal.status] : 'Outside your baseline range'
    case 'both': {
      const clin = clinicalDetail(metrics, clinical)
      const pers = personal ? PERSONAL_LABEL[personal.status] : 'deviating from your baseline'
      return `${clin} — and ${pers.toLowerCase()}`
    }
    case 'no-baseline':
      return clinical.status === 'good'
        ? 'Within healthy range (no baseline yet)'
        : clinicalDetail(metrics, clinical)
  }
}

export function classifyHybrid(
  metrics: PostureMetrics,
  options: HybridOptions
): HybridClassification {
  const { baseline, sensitivity, useClinicalLayer } = options

  const clinical = classifyAgainstClinical(metrics)
  const clinicalStatus = useClinicalLayer ? clinical.status : 'good'

  let personal: PersonalLayer | null = null
  if (baseline) {
    const personalStatus = classifyAgainstBaseline(
      metrics,
      baseline,
      TOLERANCES[sensitivity]
    )
    personal = {
      status: personalStatus,
      details: PERSONAL_LABEL[personalStatus],
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

  const details = combineDetails(reason, clinical, personal, metrics)

  return { status, reason, details, clinical, personal }
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
