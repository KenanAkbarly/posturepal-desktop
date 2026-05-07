import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Bell, RotateCcw } from 'lucide-react'
import { settingsStore, useSettings, type AppSettings } from '@/lib/settingsStore'
import { api } from '@/lib/ipc'
import { TOLERANCES, type SensitivityLevel } from '@/posture/calibration'

const SENSITIVITY_DESCRIPTION: Record<SensitivityLevel, string> = {
  low: 'Low — alerts on small deviations from your baseline (10% / 20%)',
  medium: 'Medium — balanced (15% / 30%)',
  high: 'High — alerts only on large deviations (25% / 50%)'
}

export default function Settings(): React.JSX.Element {
  const settings = useSettings()
  const update = (patch: Partial<AppSettings>): void => settingsStore.set(patch)

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure how PosturePal monitors and alerts you.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detection</CardTitle>
          <CardDescription>
            Calibration captures your individual posture. Sensitivity controls how much deviation
            triggers a warning vs poor verdict.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Camera</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Default camera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default camera</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Sensitivity</label>
            <Select
              value={settings.sensitivity}
              onValueChange={(v) => update({ sensitivity: v as SensitivityLevel })}
            >
              <SelectTrigger className="w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TOLERANCES) as SensitivityLevel[]).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {SENSITIVITY_DESCRIPTION[settings.sensitivity]}
            </p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm">Calibration baseline</span>
              <span className="text-xs text-muted-foreground">
                {settings.baseline
                  ? `Captured ${new Date(settings.baseline.capturedAt).toLocaleString()}`
                  : 'No baseline yet — calibrate from the Monitor screen.'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!settings.baseline}
              onClick={() => settingsStore.setBaseline(null)}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Recalibrate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Alerts when your posture needs attention.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Enable native notifications</span>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(v) => update({ notifications: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Play sound on poor posture</span>
            <Switch checked={settings.sound} onCheckedChange={(v) => update({ sound: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm">Test notification</span>
              <span className="text-xs text-muted-foreground">
                Verify your OS allows PosturePal to send notifications.
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => api.testNotification()}>
              <Bell className="mr-2 h-4 w-4" /> Send test
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.language}
            onValueChange={(v) => update({ language: v as AppSettings['language'] })}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="tr">Türkçe</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
