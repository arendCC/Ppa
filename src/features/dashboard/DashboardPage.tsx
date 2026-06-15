import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { DailyGoalsCard } from './components/DailyGoalsCard'
import { ProductivityOverviewCard } from './components/ProductivityOverviewCard'
import { TodayEventsCard } from './components/TodayEventsCard'
import { TodayTasksCard } from './components/TodayTasksCard'
import { WeeklyGoalsCard } from './components/WeeklyGoalsCard'

export function DashboardPage() {
  const today = new Date()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Dashboard</h1>
        <p className="text-fg-secondary">{format(today, 'EEEE, d. MMMM yyyy', { locale: de })}</p>
      </div>

      <ProductivityOverviewCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TodayEventsCard />
        <TodayTasksCard />
        <DailyGoalsCard />
        <WeeklyGoalsCard />
      </div>
    </div>
  )
}
