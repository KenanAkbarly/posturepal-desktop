import { HashRouter, Route, Routes } from 'react-router-dom'
import { Navigation } from '@/components/Navigation'
import Home from '@/pages/Home'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Settings from '@/pages/Settings'

function App(): React.JSX.Element {
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
