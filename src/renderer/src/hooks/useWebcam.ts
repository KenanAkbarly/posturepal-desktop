import { useCallback, useEffect, useRef, useState } from 'react'

export type WebcamStatus =
  | 'idle'
  | 'requesting-permission'
  | 'requesting'
  | 'streaming'
  | 'denied'
  | 'no-device'
  | 'error'

export interface UseWebcamResult {
  stream: MediaStream | null
  status: WebcamStatus
  error: string | null
  devices: MediaDeviceInfo[]
  selectedDeviceId: string | undefined
  setSelectedDeviceId: (id: string | undefined) => void
  retry: () => void
  requestAccess: () => Promise<void>
}

export function useWebcam(): UseWebcamResult {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [status, setStatus] = useState<WebcamStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined)
  const [retryToken, setRetryToken] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)

  const retry = useCallback(() => setRetryToken((n) => n + 1), [])

  const requestAccess = useCallback(async () => {
    setStatus('requesting-permission')
    try {
      const granted = await window.api.requestCameraAccess()
      if (granted) {
        retry()
      } else {
        setStatus('denied')
        setError(
          'Camera access denied. Open System Settings → Privacy & Security → Camera and enable Electron / PosturePal.'
        )
      }
    } catch (e) {
      setStatus('error')
      setError((e as Error).message)
    }
  }, [retry])

  useEffect(() => {
    let cancelled = false

    async function start(): Promise<void> {
      setStatus('requesting')
      setError(null)

      let osStatus: string = 'unknown'
      try {
        osStatus = await window.api.getCameraStatus()
        console.log(`[webcam] OS camera status: ${osStatus}`)
      } catch {
        // ignore — non-darwin or older Electron
      }

      if (osStatus === 'not-determined') {
        try {
          const granted = await window.api.requestCameraAccess()
          if (!granted && !cancelled) {
            setStatus('denied')
            setError(
              'Camera access denied. Open System Settings → Privacy & Security → Camera and enable Electron / PosturePal.'
            )
            return
          }
        } catch (e) {
          console.warn('[webcam] askForMediaAccess failed', e)
        }
      } else if (osStatus === 'denied' || osStatus === 'restricted') {
        if (!cancelled) {
          setStatus('denied')
          setError(
            'Camera access denied. Open System Settings → Privacy & Security → Camera and enable Electron / PosturePal.'
          )
          return
        }
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : { width: 1280, height: 720, facingMode: 'user' },
          audio: false
        }
        const ms = await navigator.mediaDevices.getUserMedia(constraints)
        if (cancelled) {
          ms.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = ms
        setStream(ms)
        setStatus('streaming')

        const enumerated = await navigator.mediaDevices.enumerateDevices()
        if (!cancelled) {
          setDevices(enumerated.filter((d) => d.kind === 'videoinput'))
        }
      } catch (e) {
        if (cancelled) return
        const err = e as DOMException
        console.error(`[webcam] getUserMedia error: ${err.name} — ${err.message}`)
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setStatus('denied')
          setError(
            'Camera access denied. Open System Settings → Privacy & Security → Camera and enable Electron / PosturePal.'
          )
        } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
          setStatus('no-device')
          setError('No camera found.')
        } else {
          setStatus('error')
          setError(err.message || 'Unknown camera error')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      setStream(null)
    }
  }, [selectedDeviceId, retryToken])

  return {
    stream,
    status,
    error,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    retry,
    requestAccess
  }
}
