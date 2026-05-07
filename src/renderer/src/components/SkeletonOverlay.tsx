import { useEffect, useRef } from 'react'
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision'

const POSE_CONNECTIONS: Array<[number, number]> = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [27, 29],
  [29, 31],
  [27, 31],
  [24, 26],
  [26, 28],
  [28, 30],
  [30, 32],
  [28, 32],
  [0, 7],
  [0, 8],
  [9, 10]
]

interface SkeletonOverlayProps {
  result: PoseLandmarkerResult | null
  className?: string
  mirrored?: boolean
}

export function SkeletonOverlay({
  result,
  className,
  mirrored = true
}: SkeletonOverlayProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (parent) {
      const rect = parent.getBoundingClientRect()
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!result || !result.landmarks || result.landmarks.length === 0) return

    const landmarks = result.landmarks[0]
    const w = canvas.width
    const h = canvas.height

    const xform = (x: number): number => (mirrored ? w - x * w : x * w)

    ctx.lineWidth = 3
    for (const [a, b] of POSE_CONNECTIONS) {
      const la = landmarks[a]
      const lb = landmarks[b]
      if (!la || !lb) continue
      const va = la.visibility ?? 0
      const vb = lb.visibility ?? 0
      const v = Math.min(va, vb)
      if (v < 0.3) continue
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, v + 0.2).toFixed(2)})`
      ctx.beginPath()
      ctx.moveTo(xform(la.x), la.y * h)
      ctx.lineTo(xform(lb.x), lb.y * h)
      ctx.stroke()
    }

    for (const lm of landmarks) {
      const v = lm.visibility ?? 0
      if (v < 0.3) continue
      ctx.fillStyle = `rgba(34, 197, 94, ${Math.min(1, v + 0.2).toFixed(2)})`
      ctx.beginPath()
      ctx.arc(xform(lm.x), lm.y * h, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [result, mirrored])

  return <canvas ref={canvasRef} className={className} />
}
