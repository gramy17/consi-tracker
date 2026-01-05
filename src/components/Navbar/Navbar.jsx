import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

const TITLE_BY_PATH = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/habits': 'Habits',
  '/goals': 'Goals',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

export default function Navbar() {
  const location = useLocation()
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)

  const title = TITLE_BY_PATH[location.pathname] || 'Personal Productivity OS'

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-5">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
            Structured, opinionated productivity
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  )
}
