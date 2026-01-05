import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAppStore } from '../store/useAppStore'
import { getLastNWeekStartsISO, getTodayISO } from '../utils/date'
import StatCard from '../components/Cards/StatCard'
import SectionCard from '../components/Cards/SectionCard'

function toWeekStartISOFromISOString(isoString) {
  if (!isoString) return null
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return null
  const day = d.getDay() // 0 Sunday
  const diff = (day + 6) % 7 // Monday start
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export default function AnalyticsPage() {
  const tasks = useAppStore((s) => s.tasks)
  const habits = useAppStore((s) => s.habits)
  const habitLogs = useAppStore((s) => s.habitLogs)

  const [view, setView] = useState('weekly')

  const today = getTodayISO()

  const derived = useMemo(() => {
    const tasksCompleted = tasks.filter((t) => t.status === 'completed').length
    const habitsCompletedToday = habitLogs.filter(
      (l) => l.date === today && l.completed,
    ).length

    const productivityScore = tasksCompleted * 2 + habitsCompletedToday * 1

    const weekStarts = getLastNWeekStartsISO(8)

    const completedByWeek = new Map(weekStarts.map((w) => [w, 0]))
    for (const t of tasks) {
      if (t.status !== 'completed' || !t.completedAt) continue
      const weekStart = toWeekStartISOFromISOString(t.completedAt)
      if (!weekStart) continue
      if (!completedByWeek.has(weekStart)) continue
      completedByWeek.set(weekStart, completedByWeek.get(weekStart) + 1)
    }

    const chartData = weekStarts.map((w) => ({
      week: w.slice(5),
      tasksCompleted: completedByWeek.get(w) || 0,
    }))

    // Habit consistency over the last 7 days: % of habits completed today.
    const habitConsistency = habits.length
      ? Math.round((habitsCompletedToday / habits.length) * 100)
      : 0

    return {
      tasksCompleted,
      habitsCompletedToday,
      productivityScore,
      chartData,
      habitConsistency,
    }
  }, [tasks, habits, habitLogs, today])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tasks completed (all-time)" value={derived.tasksCompleted} helper="Local state" />
        <StatCard label="Habit completion (today)" value={`${derived.habitConsistency}%`} helper="Completed / total habits" />
        <StatCard label="Productivity score" value={derived.productivityScore} helper="(tasks*2) + (habits*1)" />
      </div>

      <SectionCard
        title="Tasks completed per week"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView('weekly')}
              className={
                'rounded-lg border px-3 py-1.5 text-sm ' +
                (view === 'weekly'
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800')
              }
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setView('monthly')}
              className={
                'rounded-lg border px-3 py-1.5 text-sm ' +
                (view === 'monthly'
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800')
              }
            >
              Monthly
            </button>
          </div>
        }
      >
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Analytics are derived from local state; this is structured to swap in a backend later.
        </div>
        <div className="mt-4 h-72 w-full text-slate-900 dark:text-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={derived.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tasksCompleted" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {view === 'monthly' ? (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Monthly view is a placeholder toggle (charts remain weekly) — swap aggregation logic later.
          </div>
        ) : null}
      </SectionCard>
    </div>
  )
}
