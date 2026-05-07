import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { WebcamView, type WebcamViewHandle } from '@/components/WebcamView'
import { SkeletonOverlay } from '@/components/SkeletonOverlay'
import { CalibrationFlow } from '@/components/CalibrationFlow'
import { StatusIndicator } from '@/components/StatusIndicator'
import { Button } from '@/components/ui/button'
import { usePostureMonitor } from '@/hooks/usePostureMonitor'
import { useStatusAlerts } from '@/hooks/useStatusAlerts'
import { useSettings } from '@/lib/settingsStore'
import type { BaselineProfile } from '@/posture/calibration'

export default function Home(): React.JSX.Element {
  const webcamRef = useRef<WebcamViewHandle | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [baseline, setBaseline] = useState<BaselineProfile | null>(null)
  const settings = useSettings()

  const setVideoRef = (handle: WebcamViewHandle | null): void => {
    webcamRef.current = handle
    videoRef.current = handle?.videoElement ?? null
  }

  const { pose, metrics, smoothed, status } = usePostureMonitor(videoRef)
  useStatusAlerts(status, { notifications: settings.notifications, sound: settings.sound })

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-8">
      <Badge variant="secondary">Posture monitoring</Badge>
      <div className="relative w-full max-w-3xl">
        <WebcamView ref={setVideoRef} />
        <SkeletonOverlay
          result={pose.result}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>

      {!baseline ? (
        <CalibrationFlow metrics={metrics} onComplete={setBaseline} />
      ) : (
        <>
          <StatusIndicator status={status} metrics={smoothed ?? metrics} />
          <Button variant="ghost" size="sm" onClick={() => setBaseline(null)}>
            Recalibrate
          </Button>
        </>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          Pose: <span className="font-mono text-foreground">{pose.status}</span>
        </span>
        {pose.delegate && (
          <span>
            Delegate: <span className="font-mono text-foreground">{pose.delegate}</span>
          </span>
        )}
        <span>
          FPS: <span className="font-mono text-foreground">{pose.fps}</span>
        </span>
      </div>
    </div>
  )
}
