import { GoalAchievementSection } from './components/GoalAchievementSection'
import { ProductivityTrendsChart } from './components/ProductivityTrendsChart'
import { TasksCompletedSection } from './components/TasksCompletedSection'

export function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Statistiken</h1>
        <p className="text-fg-secondary">Auswertungen zu erledigten Aufgaben, Zielerreichung und Produktivitätstrends.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Erledigte Aufgaben</h2>
        <TasksCompletedSection />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Zielerreichung</h2>
        <GoalAchievementSection />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Produktivitätstrends</h2>
        <ProductivityTrendsChart />
      </section>
    </div>
  )
}
