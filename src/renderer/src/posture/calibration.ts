import type { PostureMetrics, PostureStatus } from './types'

export interface BaselineProfile {
  cva: number
  shoulderAsymmetry: number
  alignment: number
  capturedAt: string
  sampleCount: number
}

export class BaselineAccumulator {
  private cvaSum = 0
  private asymSum = 0
  private alignSum = 0
  private count = 0

  add(metrics: PostureMetrics): void {
    this.cvaSum += metrics.cva
    this.asymSum += metrics.shoulderAsymmetry
    this.alignSum += metrics.alignment
    this.count += 1
  }

  size(): number {
    return this.count
  }

  result(): BaselineProfile | null {
    if (this.count === 0) return null
    return {
      cva: this.cvaSum / this.count,
      shoulderAsymmetry: this.asymSum / this.count,
      alignment: this.alignSum / this.count,
      capturedAt: new Date().toISOString(),
      sampleCount: this.count
    }
  }

  reset(): void {
    this.cvaSum = 0
    this.asymSum = 0
    this.alignSum = 0
    this.count = 0
  }
}

export interface BaselineDeltas {
  cvaDelta: number
  asymmetryDelta: number
  alignmentDelta: number
}

export function applyBaseline(
  metrics: PostureMetrics,
  baseline: BaselineProfile
): BaselineDeltas {
  return {
    cvaDelta: metrics.cva - baseline.cva,
    asymmetryDelta: metrics.shoulderAsymmetry - baseline.shoulderAsymmetry,
    alignmentDelta: metrics.alignment - baseline.alignment
  }
}

export type SensitivityLevel = 'low' | 'medium' | 'high'

export interface ToleranceConfig {
  warningPct: number
  poorPct: number
}

export const TOLERANCES: Record<SensitivityLevel, ToleranceConfig> = {
  low: { warningPct: 0.1, poorPct: 0.2 },
  medium: { warningPct: 0.15, poorPct: 0.3 },
  high: { warningPct: 0.25, poorPct: 0.5 }
}

export type DeviationMetric = 'cva' | 'shoulderAsymmetry' | 'alignment'

export function deviationFraction(
  metric: DeviationMetric,
  current: number,
  baselineValue: number
): number {
  switch (metric) {
    case 'cva':
    case 'alignment':
      if (baselineValue <= 0) return 0
      return Math.max(0, (baselineValue - current) / baselineValue)
    case 'shoulderAsymmetry':
      return Math.max(0, (current - baselineValue) / 100)
  }
}

export function classifyAgainstBaseline(
  metrics: PostureMetrics,
  baseline: BaselineProfile,
  tolerance: ToleranceConfig
): PostureStatus {
  const cvaDev = deviationFraction('cva', metrics.cva, baseline.cva)
  const asymDev = deviationFraction(
    'shoulderAsymmetry',
    metrics.shoulderAsymmetry,
    baseline.shoulderAsymmetry
  )
  const alignDev = deviationFraction('alignment', metrics.alignment, baseline.alignment)
  const worst = Math.max(cvaDev, asymDev, alignDev)
  if (worst >= tolerance.poorPct) return 'poor'
  if (worst >= tolerance.warningPct) return 'warning'
  return 'good'
}
