import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <Badge variant="secondary">Posture monitoring</Badge>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">PosturePal</CardTitle>
          <CardDescription>
            Privacy-first posture monitoring. Webcam + on-device pose detection. Nothing leaves your
            machine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Webcam preview, skeleton overlay, and live posture metrics will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
