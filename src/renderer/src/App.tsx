import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import Home from '@/pages/Home'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Settings from '@/pages/Settings'
import { hydrateFromDb } from '@/lib/settingsHydration'
import { useSettings } from '@/lib/settingsStore'
import { useLanguageSync } from '@/hooks/useLanguageSync'

function App(): React.JSX.Element {
  const { hydrated } = useSettings()
  useLanguageSync()

  useEffect(() => {
    void hydrateFromDb()
  }, [])

  if (!hydrated) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <HashRouter>
      <div className="flex h-full flex-col">
        <Navigation />
        <main className="flex flex-1 flex-col overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
