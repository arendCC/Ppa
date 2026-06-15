import { Outlet } from 'react-router-dom'
import { useGenerateDueRecurringTasks } from '@/features/tasks/recurring/hooks/useGenerateDueRecurringTasks'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { MobileHeader } from './MobileHeader'

export function AppLayout() {
  useGenerateDueRecurringTasks()

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />

        <main className="flex-1 overflow-y-auto px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 md:px-8 md:pb-6 md:pt-6">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
