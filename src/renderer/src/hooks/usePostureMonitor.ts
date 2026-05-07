import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { calculatePostureMetrics, classifyPosture } from '@/posture/calculations'
import type { PostureMetrics, PostureStatus } from '@/posture/types'
import { Hysteresis, SlidingWindow } from '@/posture/smoothing'
import { usePoseDetection, type PoseDetectionState } from './usePoseDetection'

const SMOOTHING_WINDOW_FRAMES = 90
const HYSTERESIS_CONFIRM_MS = 5000

export interface PostureMonitorState {
  pose: PoseDetectionState
  metrics: PostureMetrics | null
  smoothed: PostureMetrics | null
  status: PostureStatus
  rawStatus: PostureStatus
}

export function usePostureMonitor(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled = true
): PostureMonitorState {
  const pose = usePoseDetection(videoRef, enabled)
  const [metrics, setMetrics] = useState<PostureMetrics | null>(null)
  const [smoothed, setSmoothed] = useState<PostureMetrics | null>(null)
  const [status, setStatus] = useState<PostureStatus>('good')
  const [rawStatus, setRawStatus] = useState<PostureStatus>('good')

  const cvaWindow = useRef(new SlidingWindow(SMOOTHING_WINDOW_FRAMES))
  const asymWindow = useRef(new SlidingWindow(SMOOTHING_WINDOW_FRAMES))
  const alignWindow = useRef(new SlidingWindow(SMOOTHING_WINDOW_FRAMES))
  const hysteresis = useMemo(
    () => new Hysteresis({ confirmMs: HYSTERESIS_CONFIRM_MS }, 'good'),
    []
  )

  useEffect(() => {
    if (!pose.result || !pose.result.landmarks?.[0]) return
    const landmarks = pose.result.landmarks[0].map((l) => ({
      x: l.x,
      y: l.y,
      z: l.z,
      visibility: l.visibility ?? 0
    }))
    const m = calculatePostureMetrics(landmarks)
    if (!m) return

    setMetrics(m)
    cvaWindow.current.push(m.cva)
    asymWindow.current.push(m.shoulderAsymmetry)
    alignWindow.current.push(m.alignment)

    const smoothedMetrics: PostureMetrics = {
      cva: cvaWindow.current.average(),
      shoulderAsymmetry: asymWindow.current.average(),
      alignment: alignWindow.current.average(),
      side: m.side
    }
    setSmoothed(smoothedMetrics)

    const observedStatus = classifyPosture(smoothedMetrics)
    setRawStatus(observedStatus)
    setStatus(hysteresis.feed(observedStatus))
  }, [pose.result, hysteresis])

  return { pose, metrics, smoothed, status, rawStatus }
}
