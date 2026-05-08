import { useEffect } from 'react'
import i18n from '@/i18n'
import { useSettings } from '@/lib/settingsStore'

export function useLanguageSync(): void {
  const { language } = useSettings()
  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language)
    }
  }, [language])
}
