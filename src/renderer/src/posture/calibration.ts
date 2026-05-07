import type { PostureMetrics } from './types'

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
