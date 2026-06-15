import { useState, type FormEvent } from 'react'
import { Archive, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/features/auth/AuthProvider'
import {
  useArchiveCompletedWeeklyGoals,
  useCreateWeeklyGoal,
  useDeleteWeeklyGoal,
  useUpdateWeeklyGoal,
} from '../hooks/useWeeklyGoalMutations'
import { computeProgress, formatWeekRange } from '../utils'
import type { WeeklyGoal } from '../types'
import { WeeklyGoalItem } from './WeeklyGoalItem'

interface WeeklyGoalListProps {
  goals: WeeklyGoal[]
  weekStart: string
}

/** Wochenziele der aktuellen Woche inkl. Fortschritt, Hinzufügen-Formular und Archivieren. */
export function WeeklyGoalList({ goals, weekStart }: WeeklyGoalListProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateWeeklyGoal()
  const updateMutation = useUpdateWeeklyGoal()
  const deleteMutation = useDeleteWeeklyGoal()
  const archiveMutation = useArchiveCompletedWeeklyGoals()

  const { completed, total, percent } = computeProgress(goals)
  const hasCompleted = goals.some((goal) => goal.completed)

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = title.trim()
    if (!trimmed) return

    if (!user) {
      setError('Nicht angemeldet.')
      return
    }

    try {
      await createMutation.mutateAsync({ title: trimmed, week_start: weekStart, user_id: user.id })
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  function handleToggle(goal: WeeklyGoal) {
    updateMutation.mutate({ id: goal.id, goal: { completed: !goal.completed } })
  }

  function handleDelete(goal: WeeklyGoal) {
    deleteMutation.mutate(goal.id)
  }

  function handleArchive() {
    archiveMutation.mutate(weekStart)
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg-secondary">Diese Woche · {formatWeekRange(weekStart)}</h3>
        <span className="text-sm font-medium text-fg-secondary">
          {completed} von {total} erledigt
        </span>
      </div>

      <ProgressBar value={percent} />

      <div className="space-y-2">
        {goals.length === 0 ? (
          <p className="text-sm text-fg-tertiary">Noch keine Wochenziele für diese Woche.</p>
        ) : (
          goals.map((goal) => (
            <WeeklyGoalItem key={goal.id} goal={goal} onToggle={handleToggle} onDelete={handleDelete} />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <form onSubmit={handleAdd} className="flex flex-1 gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Neues Wochenziel"
            aria-label="Neues Wochenziel"
          />
          <Button type="submit" disabled={createMutation.isPending || !title.trim()}>
            <Plus size={16} />
          </Button>
        </form>

        {hasCompleted && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleArchive}
            disabled={archiveMutation.isPending}
            title="Erledigte Wochenziele archivieren"
            aria-label="Erledigte Wochenziele archivieren"
          >
            <Archive size={16} />
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-cal-red">{error}</p>}
    </div>
  )
}
