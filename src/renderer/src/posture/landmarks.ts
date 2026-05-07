import type { Keypoints, PostureSide } from './types'

export const LANDMARK_INDEX = {
  NOSE: 0,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24
} as const

export const MIN_VISIBILITY = 0.5

export function getMostVisibleSide(keypoints: Keypoints): PostureSide | null {
  const lEar = keypoints[LANDMARK_INDEX.LEFT_EAR]
  const rEar = keypoints[LANDMARK_INDEX.RIGHT_EAR]
  const lShoulder = keypoints[LANDMARK_INDEX.LEFT_SHOULDER]
  const rShoulder = keypoints[LANDMARK_INDEX.RIGHT_SHOULDER]
  if (!lEar || !rEar || !lShoulder || !rShoulder) return null

  const left = Math.min(lEar.visibility, lShoulder.visibility)
  const right = Math.min(rEar.visibility, rShoulder.visibility)

  if (left < MIN_VISIBILITY && right < MIN_VISIBILITY) return null
  return left >= right ? 'left' : 'right'
}

export function sideLandmarkIndices(side: PostureSide): {
  ear: number
  shoulder: number
  hip: number
} {
  return side === 'left'
    ? {
        ear: LANDMARK_INDEX.LEFT_EAR,
        shoulder: LANDMARK_INDEX.LEFT_SHOULDER,
        hip: LANDMARK_INDEX.LEFT_HIP
      }
    : {
        ear: LANDMARK_INDEX.RIGHT_EAR,
        shoulder: LANDMARK_INDEX.RIGHT_SHOULDER,
        hip: LANDMARK_INDEX.RIGHT_HIP
      }
}
