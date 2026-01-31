import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { PageLoader } from "./components/LoadingSpinner";
import { firebaseEnvMissingKeys, firebaseEnvValid } from "./firebase/config";

const Layout = lazy(() => import("./layout/layout"));

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Habits = lazy(() => import("./pages/Habits"));
const Goals = lazy(() => import("./pages/Goals"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/settings"));

const App = () => {
  if (!firebaseEnvValid) {
    return (
      <div className="min-h-svh bg-[var(--ui-bg)] flex items-center justify-center p-6">
        <div className="ui-card max-w-xl w-full p-6">
          <h1 className="ui-h1">Deployment misconfigured</h1>
          <p className="ui-subtitle mt-2">
            Missing Firebase environment variables. Add these in your hosting
            provider (for Vercel: Project Settings → Environment Variables), then
            redeploy.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <p className="text-sm text-white/70 mb-2">Missing keys:</p>
            <ul className="text-sm text-white/85 space-y-1">
              {firebaseEnvMissingKeys.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <DataProvider>
                  <Layout />
                </DataProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;
