import { useTranslation } from 'react-i18next'
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
import { Bell, RotateCcw, ShieldAlert } from 'lucide-react'
import { settingsStore, useSettings, type AppSettings } from '@/lib/settingsStore'
import { api } from '@/lib/ipc'
import { TOLERANCES, type SensitivityLevel } from '@/posture/calibration'

export default function Settings(): React.JSX.Element {
  const { t } = useTranslation()
  const settings = useSettings()
  const update = (patch: Partial<AppSettings>): void => settingsStore.set(patch)

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.detection.title')}</CardTitle>
          <CardDescription>{t('settings.detection.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t('settings.detection.camera')}</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('settings.detection.defaultCamera')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t('settings.detection.defaultCamera')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t('settings.detection.sensitivity')}</label>
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
                    {t(`settings.detection.level.${level}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t(`settings.detection.sensitivityDescription.${settings.sensitivity}`)}
            </p>
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-sm">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                {t('settings.detection.clinicalLayer.label')}
              </span>
              <span className="max-w-md text-xs text-muted-foreground">
                {t('settings.detection.clinicalLayer.description')}
              </span>
            </div>
            <Switch
              checked={settings.useClinicalLayer}
              onCheckedChange={(v) => update({ useClinicalLayer: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm">{t('settings.detection.calibration.label')}</span>
              <span className="text-xs text-muted-foreground">
                {settings.baseline
                  ? t('settings.detection.calibration.captured', {
                      time: new Date(settings.baseline.capturedAt).toLocaleString()
                    })
                  : t('settings.detection.calibration.missing')}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!settings.baseline}
              onClick={() => settingsStore.setBaseline(null)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('settings.detection.calibration.recalibrate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.notifications.title')}</CardTitle>
          <CardDescription>{t('settings.notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('settings.notifications.enable')}</span>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(v) => update({ notifications: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('settings.notifications.playSound')}</span>
            <Switch checked={settings.sound} onCheckedChange={(v) => update({ sound: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm">{t('settings.notifications.test.label')}</span>
              <span className="text-xs text-muted-foreground">
                {t('settings.notifications.test.description')}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => api.testNotification()}>
              <Bell className="mr-2 h-4 w-4" /> {t('settings.notifications.test.send')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language.title')}</CardTitle>
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
              <SelectItem value="en">{t('settings.language.english')}</SelectItem>
              <SelectItem value="tr">{t('settings.language.turkish')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
