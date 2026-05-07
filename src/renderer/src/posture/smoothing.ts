import type { PostureStatus } from './types'

export class SlidingWindow {
  private values: number[] = []
  constructor(private readonly maxSize: number) {}

  push(value: number): void {
    this.values.push(value)
    if (this.values.length > this.maxSize) this.values.shift()
  }

  average(): number {
    if (this.values.length === 0) return 0
    let sum = 0
    for (const v of this.values) sum += v
    return sum / this.values.length
  }

  size(): number {
    return this.values.length
  }

  clear(): void {
    this.values = []
  }
}

export interface HysteresisOptions {
  confirmMs: number
  now?: () => number
}

export class Hysteresis {
  private currentStatus: PostureStatus = 'good'
  private candidateStatus: PostureStatus | null = null
  private candidateSince = 0
  private readonly confirmMs: number
  private readonly now: () => number

  constructor(options: HysteresisOptions, initial: PostureStatus = 'good') {
    this.confirmMs = options.confirmMs
    this.now = options.now ?? (() => Date.now())
    this.currentStatus = initial
  }

  feed(observed: PostureStatus): PostureStatus {
    const t = this.now()
    if (observed === this.currentStatus) {
      this.candidateStatus = null
      return this.currentStatus
    }
    if (this.candidateStatus !== observed) {
      this.candidateStatus = observed
      this.candidateSince = t
      return this.currentStatus
    }
    if (t - this.candidateSince >= this.confirmMs) {
      this.currentStatus = observed
      this.candidateStatus = null
    }
    return this.currentStatus
  }

  status(): PostureStatus {
    return this.currentStatus
  }

  reset(status: PostureStatus = 'good'): void {
    this.currentStatus = status
    this.candidateStatus = null
    this.candidateSince = 0
  }
}
