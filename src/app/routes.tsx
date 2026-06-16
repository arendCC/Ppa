/* eslint-disable react-refresh/only-export-components -- Router-Konfiguration, kein Komponenten-Modul für Fast Refresh. */
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AuthPage } from '@/features/auth/AuthPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorBoundary } from './RouteErrorBoundary'

const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const CalendarPage = lazy(() =>
  import('@/features/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
const TasksPage = lazy(() => import('@/features/tasks/TasksPage').then((m) => ({ default: m.TasksPage })))
const GoalsPage = lazy(() => import('@/features/goals/GoalsPage').then((m) => ({ default: m.GoalsPage })))
const NotesPage = lazy(() => import('@/features/notes/NotesPage').then((m) => ({ default: m.NotesPage })))
const StatsPage = lazy(() => import('@/features/stats/StatsPage').then((m) => ({ default: m.StatsPage })))
const FitnessPage = lazy(() =>
  import('@/features/fitness/FitnessPage').then((m) => ({ default: m.FitnessPage })),
)

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  { path: '/login', element: <AuthPage />, errorElement: <RouteErrorBoundary /> },
  { path: '/register', element: <AuthPage />, errorElement: <RouteErrorBoundary /> },
  { path: '/reset-password', element: <ResetPasswordPage />, errorElement: <RouteErrorBoundary /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: withSuspense(<DashboardPage />) },
          { path: 'calendar', element: withSuspense(<CalendarPage />) },
          { path: 'tasks', element: withSuspense(<TasksPage />) },
          { path: 'goals', element: withSuspense(<GoalsPage />) },
          { path: 'notes', element: withSuspense(<NotesPage />) },
          { path: 'fitness', element: withSuspense(<FitnessPage />) },
          { path: 'stats', element: withSuspense(<StatsPage />) },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage />, errorElement: <RouteErrorBoundary /> },
])
