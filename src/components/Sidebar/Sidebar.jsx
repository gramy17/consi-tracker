import { NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import {
  IconChart,
  IconCheckSquare,
  IconChevronLeft,
  IconChevronRight,
  IconGrid,
  IconRepeat,
  IconSettings,
  IconTarget,
} from './icons'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
  { to: '/tasks', label: 'Tasks', icon: IconCheckSquare },
  { to: '/habits', label: 'Habits', icon: IconRepeat },
  { to: '/goals', label: 'Goals', icon: IconTarget },
  { to: '/analytics', label: 'Analytics', icon: IconChart },
  { to: '/settings', label: 'Settings', icon: IconSettings },
]

function Avatar({ name }) {
  const letter = (name || 'U').trim()[0]?.toUpperCase() || 'U'
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
      {letter}
    </div>
  )
}

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.ui.sidebarCollapsed)
  const toggle = useAppStore((s) => s.toggleSidebarCollapsed)
  const user = useAppStore((s) => s.user)

  return (
    <aside
      className={
        'sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ' +
        (collapsed ? 'w-20' : 'w-72')
      }
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
            CT
          </div>
          {collapsed ? null : (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Consi Tracker</div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                Command center
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <IconChevronRight className="h-5 w-5" />
          ) : (
            <IconChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                    collapsed ? 'justify-center' : '',
                  ].join(' ')
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {collapsed ? null : <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className={"flex items-center gap-3 " + (collapsed ? 'justify-center' : '')}>
          <Avatar name={user?.name} />
          {collapsed ? null : (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{user?.name || 'User'}</div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">Local tracker</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
