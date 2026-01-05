import { useAppStore } from '../store/useAppStore'
import SectionCard from '../components/Cards/SectionCard'

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const clearAllData = useAppStore((s) => s.clearAllData)

  return (
    <div className="space-y-4">
      <SectionCard title="Theme">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Appearance</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Dark mode is class-based.</div>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
          >
            Toggle to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Data">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium">Clear stored data</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Clears tasks, habits, logs, and goals.
            </div>
          </div>
          <button
            type="button"
            onClick={() => clearAllData()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
          >
            Clear data
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
