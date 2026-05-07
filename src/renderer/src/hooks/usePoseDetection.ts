import { useEffect, useRef, useState, type RefObject } from 'react'
import type { PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision'
import { createPoseLandmarker } from '@/lib/mediapipe'

export type PoseDetectionStatus = 'idle' | 'loading' | 'running' | 'error'

export interface PoseDetectionState {
  result: PoseLandmarkerResult | null
  fps: number
  status: PoseDetectionStatus
  error: string | null
  delegate: 'GPU' | 'CPU' | null
}

export function usePoseDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled = true
): PoseDetectionState {
  const [result, setResult] = useState<PoseLandmarkerResult | null>(null)
  const [fps, setFps] = useState(0)
  const [status, setStatus] = useState<PoseDetectionStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [delegate, setDelegate] = useState<'GPU' | 'CPU' | null>(null)

  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastVideoTimeRef = useRef(-1)
  const fpsFrameCountRef = useRef(0)
  const fpsLastTickRef = useRef(performance.now())

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false
    setStatus('loading')
    setError(null)

    createPoseLandmarker()
      .then(({ landmarker, delegate: del }) => {
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker
        setDelegate(del)
        setStatus('running')
      })
      .catch((e: Error) => {
        if (cancelled) return
        console.error('[pose] failed to init landmarker', e)
        setError(e.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [enabled])

  useEffect(() => {
    if (status !== 'running') return undefined

    function tick(): void {
      const video = videoRef.current
      const landmarker = landmarkerRef.current
      if (!video || !landmarker) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime
        try {
          const detection = landmarker.detectForVideo(video, performance.now())
          setResult(detection)
        } catch (e) {
          console.error('[pose] detectForVideo error', e)
        }
        fpsFrameCountRef.current += 1
        const now = performance.now()
        const elapsed = now - fpsLastTickRef.current
        if (elapsed >= 1000) {
          setFps(Math.round((fpsFrameCountRef.current * 1000) / elapsed))
          fpsFrameCountRef.current = 0
          fpsLastTickRef.current = now
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [status, videoRef])

  return { result, fps, status, error, delegate }
}
