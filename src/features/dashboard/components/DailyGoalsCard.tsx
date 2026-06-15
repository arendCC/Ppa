import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { GoalItem } from '@/features/goals/components/GoalItem'
import { useGoals } from '@/features/goals/hooks/useGoals'
import { useUpdateGoal } from '@/features/goals/hooks/useGoalMutations'
import { computeProgress } from '@/features/goals/utils'
import type { DailyGoal } from '@/features/goals/types'

/** Dashboard-Karte: heutige Tagesziele mit Fortschrittsanzeige und Abhaken. */
export function DailyGoalsCard() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { data: goals = [] } = useGoals(today, today)
  const updateMutation = useUpdateGoal()

  const { completed, total, percent } = computeProgress(goals)

  function handleToggle(goal: DailyGoal) {
    updateMutation.mutate({ id: goal.id, goal: { completed: !goal.completed } })
  }

  return (
    <Card hover className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-fg">Tagesziele</h2>
        <Link to="/goals" className="text-sm font-medium text-accent transition-colors hover:text-accent-strong">
          Alle ansehen
        </Link>
      </div>

      {total > 0 && (
        <div className="space-y-2">
          <ProgressBar value={percent} />
          <p className="text-sm text-fg-secondary">
            {completed} von {total} erledigt
          </p>
        </div>
      )}

      <div className="space-y-2">
        {goals.length === 0 ? (
          <p className="text-sm text-fg-tertiary">Noch keine Tagesziele für heute.</p>
        ) : (
          goals.map((goal) => <GoalItem key={goal.id} goal={goal} onToggle={handleToggle} />)
        )}
      </div>
    </Card>
  )
}
