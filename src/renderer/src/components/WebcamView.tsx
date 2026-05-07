import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Camera, CameraOff, Loader2, VideoOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWebcam } from '@/hooks/useWebcam'
import { api } from '@/lib/ipc'

export interface WebcamViewHandle {
  videoElement: HTMLVideoElement | null
}

export const WebcamView = forwardRef<WebcamViewHandle, { className?: string }>(function WebcamView(
  { className },
  ref
) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { stream, status, error, retry } = useWebcam()

  useImperativeHandle(ref, () => ({ videoElement: videoRef.current }), [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (stream && video.srcObject !== stream) {
      video.srcObject = stream
    }
    if (!stream) {
      video.srcObject = null
    }
  }, [stream])

  return (
    <Card className={className}>
      <CardContent className="relative flex aspect-video w-full items-center justify-center overflow-hidden p-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        {status === 'requesting' && (
          <Overlay>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Requesting camera…</p>
          </Overlay>
        )}
        {status === 'denied' && (
          <Overlay>
            <CameraOff className="h-8 w-8 text-destructive" />
            <p className="max-w-xs text-center text-sm text-muted-foreground">{error}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => api.openCameraSettings()}>
                Open settings
              </Button>
              <Button size="sm" onClick={retry}>
                <Camera className="mr-2 h-4 w-4" /> Retry
              </Button>
            </div>
          </Overlay>
        )}
        {status === 'no-device' && (
          <Overlay>
            <VideoOff className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button size="sm" onClick={retry}>
              Retry
            </Button>
          </Overlay>
        )}
        {status === 'error' && (
          <Overlay>
            <CameraOff className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button size="sm" onClick={retry}>
              Retry
            </Button>
          </Overlay>
        )}
      </CardContent>
    </Card>
  )
})

function Overlay({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/85 backdrop-blur">
      {children}
    </div>
  )
}
