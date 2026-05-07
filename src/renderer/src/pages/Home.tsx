import { Badge } from '@/components/ui/badge'
import { WebcamView } from '@/components/WebcamView'

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-8">
      <Badge variant="secondary">Posture monitoring</Badge>
      <div className="w-full max-w-3xl">
        <WebcamView />
      </div>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Skeleton overlay and live posture metrics will land here next.
      </p>
    </div>
  )
}
