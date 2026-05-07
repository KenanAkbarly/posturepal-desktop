import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function Onboarding(): React.JSX.Element {
  const navigate = useNavigate()
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Welcome to PosturePal</CardTitle>
          <CardDescription>
            We will need access to your camera to monitor your posture. All processing happens
            locally — no images are uploaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button onClick={() => navigate('/')}>Get started</Button>
        </CardContent>
      </Card>
    </div>
  )
}
