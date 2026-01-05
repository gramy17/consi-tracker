import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import SectionCard from '../components/Cards/SectionCard'
import GoalModal from '../components/Modals/GoalModal'

function ProgressBar({ value }) {
  const clamped = Math.max(0, Math.min(100, value || 0))
  return (
    <progress
      value={clamped}
      max={100}
      className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-slate-900 dark:[&::-webkit-progress-bar]:bg-slate-800 dark:[&::-webkit-progress-value]:bg-slate-100"
      aria-label="Goal progress"
    />
  )
}

export default function GoalsPage() {
  const goals = useAppStore((s) => s.goals)
  const tasks = useAppStore((s) => s.tasks)

  const createGoal = useAppStore((s) => s.createGoal)
  const updateGoal = useAppStore((s) => s.updateGoal)
  const deleteGoal = useAppStore((s) => s.deleteGoal)
  const toggleGoalCompleted = useAppStore((s) => s.toggleGoalCompleted)

  const [modalOpen, setModalOpen] = useState(false)
  const [editGoalId, setEditGoalId] = useState(null)

  const editGoal = goals.find((g) => g.id === editGoalId) || null

  const taskById = useMemo(() => {
    const map = new Map()
    for (const t of tasks) map.set(t.id, t)
    return map
  }, [tasks])

  return (
    <div className="space-y-4">
      <SectionCard
        title="Goals"
        action={
          <button
            type="button"
            onClick={() => {
              setEditGoalId(null)
              setModalOpen(true)
            }}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            Add goal
          </button>
        }
      >
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Goals are few, visible, and long-term. Update progress manually and link tasks.
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No goals yet.
          </div>
        ) : (
          goals.map((g) => {
            const linked = (g.linkedTaskIds || [])
              .map((id) => taskById.get(id))
              .filter(Boolean)

            return (
              <div
                key={g.id}
                className={
                  'rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ' +
                  (g.status === 'completed' ? 'opacity-70' : '')
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold">{g.title}</h3>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                        {g.status}
                      </span>
                    </div>
                    {g.description ? (
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {g.description}
                      </div>
                    ) : null}
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Start: {g.startDate || '—'} • Target: {g.targetDate || '—'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleGoalCompleted(g.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      {g.status === 'completed' ? 'Reopen' : 'Complete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditGoalId(g.id)
                        setModalOpen(true)
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteGoal(g.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div>Progress</div>
                    <div>{Math.round(g.progress || 0)}%</div>
                  </div>
                  <ProgressBar value={g.progress || 0} />
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={g.progress || 0}
                      onChange={(e) => updateGoal(g.id, { progress: Number(e.target.value) })}
                      className="w-full"
                      aria-label="Update progress"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Linked tasks</div>
                  {linked.length === 0 ? (
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">No linked tasks.</div>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {linked.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div className="min-w-0 truncate">{t.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{t.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <GoalModal
        open={modalOpen}
        mode={editGoalId ? 'edit' : 'create'}
        initialValues={editGoal}
        tasks={tasks}
        onClose={() => setModalOpen(false)}
        onSubmit={(values) => {
          if (editGoalId) updateGoal(editGoalId, values)
          else createGoal(values)
          setModalOpen(false)
          setEditGoalId(null)
        }}
      />
    </div>
  )
}
