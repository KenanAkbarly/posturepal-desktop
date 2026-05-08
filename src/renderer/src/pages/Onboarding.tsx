import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Onboarding(): React.JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{t('onboarding.title')}</CardTitle>
          <CardDescription>{t('onboarding.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button onClick={() => navigate('/')}>{t('onboarding.getStarted')}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
