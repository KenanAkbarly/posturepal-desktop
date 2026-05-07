import { describe, expect, it } from 'vitest'
import { getMostVisibleSide, LANDMARK_INDEX, sideLandmarkIndices } from '../landmarks'
import type { Keypoint } from '../types'

function kp(visibility: number): Keypoint {
  return { x: 0, y: 0, visibility }
}

function makeKeypoints(values: Record<number, number>): Keypoint[] {
  const base = Array.from({ length: 33 }, () => kp(0.95))
  for (const [k, v] of Object.entries(values)) {
    base[Number(k)] = kp(v)
  }
  return base
}

describe('getMostVisibleSide', () => {
  it('returns left when left ear+shoulder have higher minimum visibility', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: 0.9,
      [LANDMARK_INDEX.LEFT_SHOULDER]: 0.9,
      [LANDMARK_INDEX.RIGHT_EAR]: 0.6,
      [LANDMARK_INDEX.RIGHT_SHOULDER]: 0.6
    })
    expect(getMostVisibleSide(keypoints)).toBe('left')
  })

  it('returns right when right side wins', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: 0.6,
      [LANDMARK_INDEX.LEFT_SHOULDER]: 0.6,
      [LANDMARK_INDEX.RIGHT_EAR]: 0.9,
      [LANDMARK_INDEX.RIGHT_SHOULDER]: 0.9
    })
    expect(getMostVisibleSide(keypoints)).toBe('right')
  })

  it('returns null when both sides fail visibility threshold', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: 0.2,
      [LANDMARK_INDEX.LEFT_SHOULDER]: 0.2,
      [LANDMARK_INDEX.RIGHT_EAR]: 0.3,
      [LANDMARK_INDEX.RIGHT_SHOULDER]: 0.3
    })
    expect(getMostVisibleSide(keypoints)).toBeNull()
  })

  it('uses the minimum of ear+shoulder visibility (weakest link)', () => {
    const keypoints = makeKeypoints({
      [LANDMARK_INDEX.LEFT_EAR]: 0.95,
      [LANDMARK_INDEX.LEFT_SHOULDER]: 0.55,
      [LANDMARK_INDEX.RIGHT_EAR]: 0.7,
      [LANDMARK_INDEX.RIGHT_SHOULDER]: 0.7
    })
    expect(getMostVisibleSide(keypoints)).toBe('right')
  })
})

describe('sideLandmarkIndices', () => {
  it('returns left ear, shoulder, hip indices', () => {
    expect(sideLandmarkIndices('left')).toEqual({
      ear: LANDMARK_INDEX.LEFT_EAR,
      shoulder: LANDMARK_INDEX.LEFT_SHOULDER,
      hip: LANDMARK_INDEX.LEFT_HIP
    })
  })

  it('returns right ear, shoulder, hip indices', () => {
    expect(sideLandmarkIndices('right')).toEqual({
      ear: LANDMARK_INDEX.RIGHT_EAR,
      shoulder: LANDMARK_INDEX.RIGHT_SHOULDER,
      hip: LANDMARK_INDEX.RIGHT_HIP
    })
  })
})
