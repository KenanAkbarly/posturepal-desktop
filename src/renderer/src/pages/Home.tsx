import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { WebcamView, type WebcamViewHandle } from '@/components/WebcamView'
import { SkeletonOverlay } from '@/components/SkeletonOverlay'
import { usePoseDetection } from '@/hooks/usePoseDetection'

export default function Home(): React.JSX.Element {
  const webcamRef = useRef<WebcamViewHandle | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const setVideoRef = (handle: WebcamViewHandle | null): void => {
    webcamRef.current = handle
    videoRef.current = handle?.videoElement ?? null
  }

  const { result, fps, status, delegate } = usePoseDetection(videoRef)

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-8">
      <Badge variant="secondary">Posture monitoring</Badge>
      <div className="relative w-full max-w-3xl">
        <WebcamView ref={setVideoRef} />
        <SkeletonOverlay
          result={result}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          Pose: <span className="font-mono text-foreground">{status}</span>
        </span>
        {delegate && (
          <span>
            Delegate: <span className="font-mono text-foreground">{delegate}</span>
          </span>
        )}
        <span>
          FPS: <span className="font-mono text-foreground">{fps}</span>
        </span>
      </div>
    </div>
  )
}
