import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { useAppStore } from './store/useAppStore'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import HabitsPage from './pages/HabitsPage'
import GoalsPage from './pages/GoalsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'

function DefaultRedirect() {
  return <Navigate to={'/dashboard'} replace />
}

export default function App() {
  const hydrateTheme = useAppStore((s) => s.hydrateTheme)

  useEffect(() => {
    hydrateTheme()
  }, [hydrateTheme])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<DefaultRedirect />} />
          <Route path="*" element={<DefaultRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
