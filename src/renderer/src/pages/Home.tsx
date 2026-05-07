import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { WebcamView, type WebcamViewHandle } from '@/components/WebcamView'
import { SkeletonOverlay } from '@/components/SkeletonOverlay'
import { CalibrationFlow } from '@/components/CalibrationFlow'
import { usePostureMonitor } from '@/hooks/usePostureMonitor'
import type { BaselineProfile } from '@/posture/calibration'

export default function Home(): React.JSX.Element {
  const webcamRef = useRef<WebcamViewHandle | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [baseline, setBaseline] = useState<BaselineProfile | null>(null)

  const setVideoRef = (handle: WebcamViewHandle | null): void => {
    webcamRef.current = handle
    videoRef.current = handle?.videoElement ?? null
  }

  const { pose, metrics, status } = usePostureMonitor(videoRef)

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
        <div className="flex w-full max-w-3xl flex-col items-center gap-3 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">
            Status: <span className="font-mono text-foreground">{status}</span>
          </div>
          {metrics && (
            <div className="grid w-full grid-cols-3 gap-4 text-center text-xs">
              <Stat label="CVA" value={`${metrics.cva.toFixed(1)}°`} />
              <Stat label="Asymmetry" value={`${metrics.shoulderAsymmetry.toFixed(1)}%`} />
              <Stat label="Alignment" value={`${metrics.alignment.toFixed(1)}°`} />
            </div>
          )}
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => setBaseline(null)}
          >
            Recalibrate
          </button>
        </div>
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

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <span className="uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-mono text-base">{value}</span>
    </div>
  )
}
