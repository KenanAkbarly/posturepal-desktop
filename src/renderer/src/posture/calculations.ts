import type { Keypoints, Point, PostureMetrics } from './types'
import { LANDMARK_INDEX, MIN_VISIBILITY, getMostVisibleSide, sideLandmarkIndices } from './landmarks'

const RAD_TO_DEG = 180 / Math.PI

export function calculateCVA(ear: Point, shoulder: Point): number {
  const dx = shoulder.x - ear.x
  const dy = shoulder.y - ear.y
  return Math.atan2(Math.abs(dy), Math.abs(dx)) * RAD_TO_DEG
}

export function calculateShoulderAsymmetry(leftShoulder: Point, rightShoulder: Point): number {
  const yDiff = Math.abs(leftShoulder.y - rightShoulder.y)
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x)
  if (shoulderWidth < 1e-6) return 0
  return (yDiff / shoulderWidth) * 100
}

export function calculateAlignmentAngle(ear: Point, shoulder: Point, hip: Point): number {
  const v1x = ear.x - shoulder.x
  const v1y = ear.y - shoulder.y
  const v2x = hip.x - shoulder.x
  const v2y = hip.y - shoulder.y
  const dot = v1x * v2x + v1y * v2y
  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y)
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y)
  if (mag1 < 1e-6 || mag2 < 1e-6) return 180
  const cosAngle = dot / (mag1 * mag2)
  const clamped = Math.max(-1, Math.min(1, cosAngle))
  return Math.acos(clamped) * RAD_TO_DEG
}

export function calculatePostureMetrics(keypoints: Keypoints): PostureMetrics | null {
  const side = getMostVisibleSide(keypoints)
  if (!side) return null

  const idx = sideLandmarkIndices(side)
  const ear = keypoints[idx.ear]
  const shoulder = keypoints[idx.shoulder]
  const hip = keypoints[idx.hip]
  const lShoulder = keypoints[LANDMARK_INDEX.LEFT_SHOULDER]
  const rShoulder = keypoints[LANDMARK_INDEX.RIGHT_SHOULDER]

  if (!ear || !shoulder || !hip || !lShoulder || !rShoulder) return null
  if (ear.visibility < MIN_VISIBILITY || shoulder.visibility < MIN_VISIBILITY) return null

  const cva = calculateCVA(ear, shoulder)
  const shoulderAsymmetry =
    lShoulder.visibility >= MIN_VISIBILITY && rShoulder.visibility >= MIN_VISIBILITY
      ? calculateShoulderAsymmetry(lShoulder, rShoulder)
      : 0
  const alignment =
    hip.visibility >= MIN_VISIBILITY ? calculateAlignmentAngle(ear, shoulder, hip) : 180

  return { cva, shoulderAsymmetry, alignment, side }
}

const CVA_GOOD = 50
const CVA_WARNING = 48
const ASYMMETRY_GOOD = 4
const ASYMMETRY_WARNING = 6
const ALIGNMENT_GOOD = 165
const ALIGNMENT_WARNING = 160

export function classifyMetric(
  metric: keyof Pick<PostureMetrics, 'cva' | 'shoulderAsymmetry' | 'alignment'>,
  value: number
): 'good' | 'warning' | 'poor' {
  switch (metric) {
    case 'cva':
      if (value >= CVA_GOOD) return 'good'
      if (value >= CVA_WARNING) return 'warning'
      return 'poor'
    case 'shoulderAsymmetry':
      if (value <= ASYMMETRY_GOOD) return 'good'
      if (value <= ASYMMETRY_WARNING) return 'warning'
      return 'poor'
    case 'alignment':
      if (value >= ALIGNMENT_GOOD) return 'good'
      if (value >= ALIGNMENT_WARNING) return 'warning'
      return 'poor'
  }
}

export function classifyPosture(metrics: PostureMetrics): 'good' | 'warning' | 'poor' {
  const verdicts = [
    classifyMetric('cva', metrics.cva),
    classifyMetric('shoulderAsymmetry', metrics.shoulderAsymmetry),
    classifyMetric('alignment', metrics.alignment)
  ]
  if (verdicts.includes('poor')) return 'poor'
  if (verdicts.includes('warning')) return 'warning'
  return 'good'
}
