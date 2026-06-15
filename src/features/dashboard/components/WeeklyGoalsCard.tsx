import { Link } from 'react-router-dom'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { WeeklyGoalItem } from '@/features/weekly-goals/components/WeeklyGoalItem'
import { useWeeklyGoals } from '@/features/weekly-goals/hooks/useWeeklyGoals'
import { useUpdateWeeklyGoal } from '@/features/weekly-goals/hooks/useWeeklyGoalMutations'
import { computeProgress, getWeekStart } from '@/features/weekly-goals/utils'
import type { WeeklyGoal } from '@/features/weekly-goals/types'

/** Dashboard-Karte: Wochenziele der aktuellen Woche mit Fortschrittsanzeige und Abhaken. */
export function WeeklyGoalsCard() {
  const currentWeekStart = getWeekStart(new Date())
  const { data: goals = [] } = useWeeklyGoals(currentWeekStart, currentWeekStart)
  const updateMutation = useUpdateWeeklyGoal()

  const activeGoals = goals.filter((goal) => !goal.archived)
  const { completed, total, percent } = computeProgress(activeGoals)

  function handleToggle(goal: WeeklyGoal) {
    updateMutation.mutate({ id: goal.id, goal: { completed: !goal.completed } })
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-fg">Wochenziele</h2>
        <Link to="/goals" className="text-sm font-medium text-accent hover:underline">
          Alle ansehen
        </Link>
      </div>

      {total > 0 && (
        <>
          <ProgressBar value={percent} />
          <p className="text-sm text-fg-secondary">
            {completed} von {total} erledigt
          </p>
        </>
      )}

      <div className="space-y-2">
        {activeGoals.length === 0 ? (
          <p className="text-sm text-fg-tertiary">Noch keine Wochenziele für diese Woche.</p>
        ) : (
          activeGoals.map((goal) => <WeeklyGoalItem key={goal.id} goal={goal} onToggle={handleToggle} />)
        )}
      </div>
    </div>
  )
}
