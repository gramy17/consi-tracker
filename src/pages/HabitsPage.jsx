import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getTodayISO } from '../utils/date'
import SectionCard from '../components/Cards/SectionCard'
import HabitModal from '../components/Modals/HabitModal'

function StreakBadge({ streak }) {
  const cls =
    streak >= 14
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200'
      : streak >= 7
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200'
        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {streak} day{streak === 1 ? '' : 's'}
    </span>
  )
}

export default function HabitsPage() {
  const habits = useAppStore((s) => s.habits)
  const habitLogs = useAppStore((s) => s.habitLogs)

  const createHabit = useAppStore((s) => s.createHabit)
  const deleteHabit = useAppStore((s) => s.deleteHabit)
  const checkInHabitOnDate = useAppStore((s) => s.checkInHabitOnDate)
  const uncheckHabitOnDate = useAppStore((s) => s.uncheckHabitOnDate)

  const [modalOpen, setModalOpen] = useState(false)

  const today = getTodayISO()
  const [selectedDate, setSelectedDate] = useState(today)

  const completedToday = useMemo(() => {
    const set = new Set(
      habitLogs
        .filter((l) => l.date === selectedDate && l.completed)
        .map((l) => l.habitId),
    )
    return set
  }, [habitLogs, selectedDate])

  return (
    <div className="space-y-4">
      <SectionCard
        title="Habits"
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            Add habit
          </button>
        }
      >
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Pick a date to track. Habits are binary: done / not done.
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            />
          </div>
        </div>
      </SectionCard>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {habits.length === 0 ? (
            <div className="p-5 text-sm text-slate-600 dark:text-slate-400">No habits yet.</div>
          ) : (
            habits.map((h) => {
              const isDone = completedToday.has(h.id)
              return (
                <div key={h.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">{h.name}</div>
                      <StreakBadge streak={h.streak || 0} />
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Frequency: daily • Date: {selectedDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {
                          if (isDone) uncheckHabitOnDate(h.id, selectedDate)
                          else checkInHabitOnDate(h.id, selectedDate)
                        }}
                      />
                      Done
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteHabit(h.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <HabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(values) => {
          createHabit(values)
          setModalOpen(false)
        }}
      />
    </div>
  )
}
