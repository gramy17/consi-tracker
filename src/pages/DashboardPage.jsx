import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getTodayISO } from '../utils/date'
import StatCard from '../components/Cards/StatCard'
import SectionCard from '../components/Cards/SectionCard'
import TaskModal from '../components/Modals/TaskModal'
import HabitModal from '../components/Modals/HabitModal'
import GoalModal from '../components/Modals/GoalModal'

function sortTasksByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    const aDue = a.dueDate || '9999-12-31'
    const bDue = b.dueDate || '9999-12-31'
    if (aDue < bDue) return -1
    if (aDue > bDue) return 1
    return (b.createdAt || '').localeCompare(a.createdAt || '')
  })
}

export default function DashboardPage() {
  const tasks = useAppStore((s) => s.tasks)
  const habits = useAppStore((s) => s.habits)
  const habitLogs = useAppStore((s) => s.habitLogs)
  const goals = useAppStore((s) => s.goals)

  const createTask = useAppStore((s) => s.createTask)
  const createHabit = useAppStore((s) => s.createHabit)
  const createGoal = useAppStore((s) => s.createGoal)

  const [taskOpen, setTaskOpen] = useState(false)
  const [habitOpen, setHabitOpen] = useState(false)
  const [goalOpen, setGoalOpen] = useState(false)

  const today = getTodayISO()

  const derived = useMemo(() => {
    const dueTodayCount = tasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && t.dueDate === today,
    ).length

    const habitsCompletedToday = habitLogs.filter(
      (l) => l.date === today && l.completed,
    ).length

    const activeGoalsCount = goals.filter((g) => g.status === 'active').length

    const nextTasks = sortTasksByDueDate(tasks)
      .filter((t) => t.status !== 'completed')
      .slice(0, 5)

    const streaks = habits
      .map((h) => ({ id: h.id, name: h.name, streak: h.streak || 0 }))
      .sort((a, b) => b.streak - a.streak)

    return {
      dueTodayCount,
      habitsCompletedToday,
      activeGoalsCount,
      nextTasks,
      streaks,
    }
  }, [tasks, habits, habitLogs, goals, today])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tasks due today" value={derived.dueTodayCount} helper={today} />
        <StatCard label="Habits completed today" value={derived.habitsCompletedToday} helper="Binary check-ins" />
        <StatCard label="Active goals" value={derived.activeGoalsCount} helper="Long-term outcomes" />
      </div>

      <SectionCard
        title="Quick add"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTaskOpen(true)}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              Add task
            </button>
            <button
              type="button"
              onClick={() => setHabitOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
            >
              Add habit
            </button>
            <button
              type="button"
              onClick={() => setGoalOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
            >
              Add goal
            </button>
          </div>
        }
      >
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Dashboard is derived-only: manage items in their dedicated pages.
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Today’s next tasks">
          {derived.nextTasks.length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-400">No upcoming tasks.</div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {derived.nextTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.title}</div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Due: {t.dueDate || 'No due date'}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.priority}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Habit streak overview">
          {derived.streaks.length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-400">No habits yet.</div>
          ) : (
            <div className="space-y-3">
              {derived.streaks.map((h) => (
                <div key={h.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 truncate text-sm font-medium">{h.name}</div>
                  <div className="rounded-full border border-slate-200 px-2 py-1 text-xs dark:border-slate-800">
                    {h.streak} day{h.streak === 1 ? '' : 's'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <TaskModal
        open={taskOpen}
        mode="create"
        onClose={() => setTaskOpen(false)}
        onSubmit={(values) => {
          createTask(values)
          setTaskOpen(false)
        }}
      />

      <HabitModal
        open={habitOpen}
        onClose={() => setHabitOpen(false)}
        onSubmit={(values) => {
          createHabit(values)
          setHabitOpen(false)
        }}
      />

      <GoalModal
        open={goalOpen}
        mode="create"
        tasks={tasks}
        onClose={() => setGoalOpen(false)}
        onSubmit={(values) => {
          createGoal(values)
          setGoalOpen(false)
        }}
      />
    </div>
  )
}
