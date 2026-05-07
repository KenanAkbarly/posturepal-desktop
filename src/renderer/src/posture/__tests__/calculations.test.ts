import { describe, expect, it } from 'vitest'
import {
  calculateAlignmentAngle,
  calculateCVA,
  calculatePostureMetrics,
  calculateShoulderAsymmetry,
  classifyMetric,
  classifyPosture
} from '../calculations'
import type { Keypoint, Keypoints } from '../types'
import { LANDMARK_INDEX } from '../landmarks'

function kp(x: number, y: number, visibility = 0.95): Keypoint {
  return { x, y, visibility }
}

function makeKeypoints(overrides: Partial<Record<number, Keypoint>>): Keypoints {
  const base = Array.from({ length: 33 }, () => kp(0.5, 0.5, 0.95))
  for (const [k, v] of Object.entries(overrides)) {
    base[Number(k)] = v as Keypoint
  }
  return base
}

describe('calculateCVA', () => {
  it('returns 0 when ear and shoulder share a y-coordinate (perfectly horizontal)', () => {
    expect(calculateCVA({ x: 0.4, y: 0.3 }, { x: 0.5, y: 0.3 })).toBeCloseTo(0, 5)
  })

  it('returns 45 when dx == dy', () => {
    expect(calculateCVA({ x: 0.4, y: 0.3 }, { x: 0.5, y: 0.4 })).toBeCloseTo(45, 5)
  })

  it('returns ~63 for slight forward head (more vertical drop than horizontal)', () => {
    const angle = calculateCVA({ x: 0.5, y: 0.2 }, { x: 0.55, y: 0.3 })
    expect(angle).toBeGreaterThan(60)
    expect(angle).toBeLessThan(65)
  })

  it('returns 90 when ear directly above shoulder', () => {
    expect(calculateCVA({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.4 })).toBeCloseTo(90, 5)
  })
})

describe('calculateShoulderAsymmetry', () => {
  it('returns 0 for level shoulders', () => {
    expect(calculateShoulderAsymmetry({ x: 0.4, y: 0.5 }, { x: 0.6, y: 0.5 })).toBe(0)
  })

  it('returns 10 when y-diff is 10% of shoulder width', () => {
    expect(calculateShoulderAsymmetry({ x: 0.4, y: 0.5 }, { x: 0.6, y: 0.52 })).toBeCloseTo(10, 5)
  })

  it('returns 0 (not Infinity) when shoulders overlap (zero width)', () => {
    expect(calculateShoulderAsymmetry({ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.6 })).toBe(0)
  })

  it('is independent of camera distance (pixel-equivalent inputs scale)', () => {
    const close = calculateShoulderAsymmetry({ x: 0.3, y: 0.5 }, { x: 0.7, y: 0.54 })
    const far = calculateShoulderAsymmetry({ x: 0.45, y: 0.5 }, { x: 0.55, y: 0.51 })
    expect(close).toBeCloseTo(far, 5)
  })
})

describe('calculateAlignmentAngle', () => {
  it('returns 180 when ear, shoulder, hip are colinear vertically', () => {
    const angle = calculateAlignmentAngle(
      { x: 0.5, y: 0.2 },
      { x: 0.5, y: 0.4 },
      { x: 0.5, y: 0.7 }
    )
    expect(angle).toBeCloseTo(180, 4)
  })

  it('returns 90 for a right-angle bend at the shoulder', () => {
    const angle = calculateAlignmentAngle(
      { x: 0.5, y: 0.2 },
      { x: 0.5, y: 0.4 },
      { x: 0.7, y: 0.4 }
    )
    expect(angle).toBeCloseTo(90, 4)
  })

  it('returns 180 (safe default) when shoulder coincides with ear', () => {
    expect(
      calculateAlignmentAngle({ x: 0.5, y: 0.4 }, { x: 0.5, y: 0.4 }, { x: 0.5, y: 0.7 })
    ).toBe(180)
  })
})

describe('calculatePostureMetrics', () => {
  it('returns null when both sides have low visibility', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: kp(0.4, 0.2, 0.1),
      [LANDMARK_INDEX.RIGHT_EAR]: kp(0.6, 0.2, 0.1),
      [LANDMARK_INDEX.LEFT_SHOULDER]: kp(0.4, 0.4, 0.1),
      [LANDMARK_INDEX.RIGHT_SHOULDER]: kp(0.6, 0.4, 0.1)
    })
    expect(calculatePostureMetrics(keypoints)).toBeNull()
  })

  it('computes metrics for a textbook upright posture', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: kp(0.45, 0.2),
      [LANDMARK_INDEX.RIGHT_EAR]: kp(0.55, 0.2),
      [LANDMARK_INDEX.LEFT_SHOULDER]: kp(0.4, 0.4),
      [LANDMARK_INDEX.RIGHT_SHOULDER]: kp(0.6, 0.4),
      [LANDMARK_INDEX.LEFT_HIP]: kp(0.4, 0.7),
      [LANDMARK_INDEX.RIGHT_HIP]: kp(0.6, 0.7)
    })
    const metrics = calculatePostureMetrics(keypoints)
    expect(metrics).not.toBeNull()
    expect(metrics!.shoulderAsymmetry).toBeCloseTo(0, 4)
    expect(metrics!.alignment).toBeGreaterThan(150)
    expect(metrics!.cva).toBeGreaterThan(60)
  })

  it('flags poor posture: forward head + uneven shoulders + spinal curl', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: kp(0.55, 0.3),
      [LANDMARK_INDEX.RIGHT_EAR]: kp(0.65, 0.3),
      [LANDMARK_INDEX.LEFT_SHOULDER]: kp(0.4, 0.42),
      [LANDMARK_INDEX.RIGHT_SHOULDER]: kp(0.6, 0.5),
      [LANDMARK_INDEX.LEFT_HIP]: kp(0.4, 0.7),
      [LANDMARK_INDEX.RIGHT_HIP]: kp(0.6, 0.75)
    })
    const metrics = calculatePostureMetrics(keypoints)
    expect(metrics).not.toBeNull()
    expect(classifyPosture(metrics!)).toBe('poor')
  })
})

describe('classifyMetric', () => {
  it('flags low CVA as poor', () => {
    expect(classifyMetric('cva', 30)).toBe('poor')
    expect(classifyMetric('cva', 49)).toBe('warning')
    expect(classifyMetric('cva', 55)).toBe('good')
  })

  it('flags asymmetry crossing thresholds', () => {
    expect(classifyMetric('shoulderAsymmetry', 2)).toBe('good')
    expect(classifyMetric('shoulderAsymmetry', 5)).toBe('warning')
    expect(classifyMetric('shoulderAsymmetry', 10)).toBe('poor')
  })

  it('flags alignment crossing thresholds', () => {
    expect(classifyMetric('alignment', 170)).toBe('good')
    expect(classifyMetric('alignment', 162)).toBe('warning')
    expect(classifyMetric('alignment', 140)).toBe('poor')
  })
})
