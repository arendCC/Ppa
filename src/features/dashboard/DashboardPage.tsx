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
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">Dashboard</h1>
        <p className="mt-1.5 text-fg-secondary">{format(today, 'EEEE, d. MMMM yyyy', { locale: de })}</p>
      </div>

      <ProductivityOverviewCard />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TodayEventsCard />
        <TodayTasksCard />
        <DailyGoalsCard />
        <WeeklyGoalsCard />
      </div>
    </div>
  )
}
