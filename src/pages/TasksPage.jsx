import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getTodayISO } from '../utils/date'
import SectionCard from '../components/Cards/SectionCard'
import TaskModal from '../components/Modals/TaskModal'

function priorityRank(priority) {
  if (priority === 'high') return 3
  if (priority === 'medium') return 2
  return 1
}

function PriorityPill({ priority }) {
  const cls =
    priority === 'high'
      ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200'
      : priority === 'medium'
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {priority}
    </span>
  )
}

export default function TasksPage() {
  const tasks = useAppStore((s) => s.tasks)
  const createTask = useAppStore((s) => s.createTask)
  const updateTask = useAppStore((s) => s.updateTask)
  const deleteTask = useAppStore((s) => s.deleteTask)
  const toggleTaskCompleted = useAppStore((s) => s.toggleTaskCompleted)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState(null)

  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dueFilter, setDueFilter] = useState('all')
  const [sortKey, setSortKey] = useState('dueDate')
  const [tagFilter, setTagFilter] = useState('all')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')

  const today = getTodayISO()

  const editTask = tasks.find((t) => t.id === editTaskId) || null

  const availableTags = useMemo(() => {
    const set = new Set()
    for (const t of tasks) {
      for (const tag of t.tags || []) set.add(tag)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [tasks])

  const visible = useMemo(() => {
    let list = [...tasks]

    if (rangeFrom || rangeTo) {
      list = list.filter((t) => {
        if (!t.dueDate) return false
        if (rangeFrom && t.dueDate < rangeFrom) return false
        if (rangeTo && t.dueDate > rangeTo) return false
        return true
      })
    }

    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      list = list.filter((t) => t.priority === priorityFilter)
    }

    if (dueFilter === 'today') {
      list = list.filter((t) => t.dueDate === today)
    } else if (dueFilter === 'upcoming') {
      list = list.filter((t) => t.dueDate && t.dueDate > today)
    }

    if (tagFilter !== 'all') {
      list = list.filter((t) => (t.tags || []).includes(tagFilter))
    }

    if (sortKey === 'priority') {
      list.sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority))
    } else {
      list.sort((a, b) => {
        const aDue = a.dueDate || '9999-12-31'
        const bDue = b.dueDate || '9999-12-31'
        if (aDue < bDue) return -1
        if (aDue > bDue) return 1
        return priorityRank(b.priority) - priorityRank(a.priority)
      })
    }

    return list
  }, [tasks, statusFilter, priorityFilter, dueFilter, tagFilter, sortKey, today, rangeFrom, rangeTo])

  return (
    <div className="space-y-4">
      <SectionCard
        title="Tasks"
        action={
          <button
            type="button"
            onClick={() => {
              setEditTaskId(null)
              setModalOpen(true)
            }}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            Add task
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Due</label>
            <select
              value={dueFilter}
              onChange={(e) => setDueFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">From</label>
            <input
              type="date"
              value={rangeFrom}
              onChange={(e) => setRangeFrom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">To</label>
            <input
              type="date"
              value={rangeTo}
              onChange={(e) => setRangeTo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Tag</label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="all">All</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Sort</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {visible.length === 0 ? (
            <div className="p-5 text-sm text-slate-600 dark:text-slate-400">No tasks match your filters.</div>
          ) : (
            visible.map((t) => (
              <div
                key={t.id}
                className={
                  'flex items-start justify-between gap-4 p-4 ' +
                  (t.status === 'completed' ? 'opacity-60' : '')
                }
              >
                <div className="flex min-w-0 gap-3">
                  <input
                    type="checkbox"
                    checked={t.status === 'completed'}
                    onChange={() => toggleTaskCompleted(t.id)}
                    className="mt-1 h-4 w-4"
                    aria-label="Mark complete"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-medium">{t.title}</div>
                      <PriorityPill priority={t.priority} />
                      {t.dueDate ? (
                        <span className="text-xs text-slate-500 dark:text-slate-400">Due {t.dueDate}</span>
                      ) : null}
                    </div>
                    {t.description ? (
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {t.description}
                      </div>
                    ) : null}
                    {(t.tags || []).length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditTaskId(t.id)
                      setModalOpen(true)
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(t.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        mode={editTaskId ? 'edit' : 'create'}
        initialValues={editTask}
        onClose={() => setModalOpen(false)}
        onSubmit={(values) => {
          if (editTaskId) {
            updateTask(editTaskId, values)
          } else {
            createTask(values)
          }
          setModalOpen(false)
          setEditTaskId(null)
        }}
      />
    </div>
  )
}
