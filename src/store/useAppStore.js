import { create } from 'zustand'
import { createId } from '../utils/id'
import { getTodayISO } from '../utils/date'

const DEFAULT_STATE = {
  user: {
    name: 'Guest',
  },
  theme: 'light',
  tasks: [],
  habits: [],
  habitLogs: [],
  goals: [],
  ui: {
    sidebarCollapsed: false,
  },
}

function calculateHabitStreak(habitId, habitLogs) {
  const completedDates = new Set(
    habitLogs
      .filter((l) => l.habitId === habitId && l.completed)
      .map((l) => l.date),
  )

  let streak = 0
  let cursor = getTodayISO()

  // Walk backwards from today while completed.
  while (completedDates.has(cursor)) {
    streak += 1
    const [y, m, d] = cursor.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    date.setDate(date.getDate() - 1)
    const yy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    cursor = `${yy}-${mm}-${dd}`
  }

  return streak
}

export const useAppStore = create((set, get) => ({
  ...DEFAULT_STATE,

  hydrateTheme: () => {
    const { theme } = get()
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  },

  setTheme: (theme) => {
    set({ theme })
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  },

  toggleSidebarCollapsed: () => {
    set((state) => ({
      ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
    }))
  },

  clearAllData: () => {
    const { theme, ui, user } = get()
    set({
      ...DEFAULT_STATE,
      theme,
      ui,
      user,
    })
  },

  // Tasks
  createTask: (input) => {
    const now = new Date().toISOString()
    const task = {
      id: createId('task_'),
      title: input.title,
      description: input.description || '',
      priority: input.priority || 'medium',
      dueDate: input.dueDate || '',
      status: 'pending',
      tags: input.tags || [],
      createdAt: now,
      completedAt: null,
    }
    set((state) => ({ tasks: [task, ...state.tasks] }))
  },

  updateTask: (taskId, patch) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              ...patch,
            }
          : t,
      ),
    }))
  },

  deleteTask: (taskId) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }))
    set((state) => ({
      goals: state.goals.map((g) => ({
        ...g,
        linkedTaskIds: (g.linkedTaskIds || []).filter((id) => id !== taskId),
      })),
    }))
  },

  toggleTaskCompleted: (taskId) => {
    const now = new Date().toISOString()
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed'
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? now : null,
        }
      }),
    }))
  },

  // Habits
  createHabit: (input) => {
    const now = new Date().toISOString()
    const habit = {
      id: createId('habit_'),
      name: input.name,
      frequency: 'daily',
      streak: 0,
      createdAt: now,
    }
    set((state) => ({ habits: [habit, ...state.habits] }))
  },

  deleteHabit: (habitId) => {
    set((state) => ({ habits: state.habits.filter((h) => h.id !== habitId) }))
    set((state) => ({
      habitLogs: state.habitLogs.filter((l) => l.habitId !== habitId),
    }))
  },

  checkInHabitOnDate: (habitId, dateISO) => {
    const date = dateISO || getTodayISO()
    const { habitLogs } = get()
    const already = habitLogs.some((l) => l.habitId === habitId && l.date === date)
    if (already) return

    const nextLogs = [
      {
        habitId,
        date,
        completed: true,
      },
      ...habitLogs,
    ]

    const nextStreak = calculateHabitStreak(habitId, nextLogs)

    set((state) => ({
      habitLogs: nextLogs,
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              streak: nextStreak,
            }
          : h,
      ),
    }))
  },

  checkInHabitToday: (habitId) => {
    get().checkInHabitOnDate(habitId, getTodayISO())
  },

  uncheckHabitOnDate: (habitId, dateISO) => {
    const date = dateISO || getTodayISO()
    const nextLogs = get().habitLogs.filter((l) => !(l.habitId === habitId && l.date === date))
    const nextStreak = calculateHabitStreak(habitId, nextLogs)
    set((state) => ({
      habitLogs: nextLogs,
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              streak: nextStreak,
            }
          : h,
      ),
    }))
  },

  uncheckHabitToday: (habitId) => {
    get().uncheckHabitOnDate(habitId, getTodayISO())
  },

  // Goals
  createGoal: (input) => {
    const goal = {
      id: createId('goal_'),
      title: input.title,
      description: input.description || '',
      startDate: input.startDate || '',
      targetDate: input.targetDate || '',
      progress: Number.isFinite(input.progress) ? input.progress : 0,
      status: 'active',
      linkedTaskIds: input.linkedTaskIds || [],
    }
    set((state) => ({ goals: [goal, ...state.goals] }))
  },

  updateGoal: (goalId, patch) => {
    set((state) => ({
      goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...patch } : g)),
    }))
  },

  deleteGoal: (goalId) => {
    set((state) => ({ goals: state.goals.filter((g) => g.id !== goalId) }))
  },

  toggleGoalCompleted: (goalId) => {
    set((state) => ({
      goals: state.goals.map((g) => {
        if (g.id !== goalId) return g
        const nextStatus = g.status === 'completed' ? 'active' : 'completed'
        return { ...g, status: nextStatus }
      }),
    }))
  },
}))
