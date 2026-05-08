import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Activity, BarChart3, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation(): React.JSX.Element {
  const { t } = useTranslation()
  const links = [
    { to: '/', label: t('nav.monitor'), icon: Activity },
    { to: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { to: '/settings', label: t('nav.settings'), icon: SettingsIcon }
  ]
  return (
    <nav className="flex items-center justify-between border-b bg-background/60 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-5 w-5 text-primary" />
        <span>{t('common.appName')}</span>
      </div>
      <div className="flex items-center gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
