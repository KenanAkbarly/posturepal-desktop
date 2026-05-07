export interface Point {
  x: number
  y: number
  z?: number
}

export interface Keypoint extends Point {
  visibility: number
}

export type Keypoints = Keypoint[]

export type PostureSide = 'left' | 'right'

export interface PostureMetrics {
  cva: number
  shoulderAsymmetry: number
  alignment: number
  side: PostureSide
}

export type PostureStatus = 'good' | 'warning' | 'poor'
