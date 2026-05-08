import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { WebcamView, type WebcamViewHandle } from '@/components/WebcamView'
import { SkeletonOverlay } from '@/components/SkeletonOverlay'
import { CalibrationFlow } from '@/components/CalibrationFlow'
import { StatusIndicator } from '@/components/StatusIndicator'
import { BaselineCard } from '@/components/BaselineCard'
import { usePostureMonitor } from '@/hooks/usePostureMonitor'
import { useStatusAlerts } from '@/hooks/useStatusAlerts'
import { useSnapshotPersistence } from '@/hooks/useSnapshotPersistence'
import { settingsStore, useSettings } from '@/lib/settingsStore'
import { api } from '@/lib/ipc'

export default function Home(): React.JSX.Element {
  const webcamRef = useRef<WebcamViewHandle | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const settings = useSettings()
  const baseline = settings.baseline

  const setVideoRef = (handle: WebcamViewHandle | null): void => {
    webcamRef.current = handle
    videoRef.current = handle?.videoElement ?? null
  }

  const { pose, metrics, smoothed, classification, status } = usePostureMonitor(videoRef, {
    baseline,
    sensitivity: settings.sensitivity,
    useClinicalLayer: settings.useClinicalLayer
  })
  useStatusAlerts(status, { notifications: settings.notifications, sound: settings.sound })
  useSnapshotPersistence({ enabled: !!baseline, smoothed, status })

  useEffect(() => {
    void api.setTrayStatus(baseline ? status : 'idle')
  }, [status, baseline])

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
        <CalibrationFlow metrics={metrics} onComplete={(b) => settingsStore.setBaseline(b)} />
      ) : (
        <>
          <StatusIndicator
            status={status}
            classification={classification}
            metrics={smoothed ?? metrics}
          />
          <BaselineCard baseline={baseline} deltas={classification?.personal?.deltas ?? null} />
          <Button variant="ghost" size="sm" onClick={() => settingsStore.setBaseline(null)}>
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
        <span>
          Sensitivity: <span className="font-mono text-foreground">{settings.sensitivity}</span>
        </span>
        <span>
          Clinical:{' '}
          <span className="font-mono text-foreground">
            {settings.useClinicalLayer ? 'on' : 'off'}
          </span>
        </span>
      </div>
    </div>
  )
}
