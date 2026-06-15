import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/features/auth/AuthProvider'
import { useCreateGoal, useDeleteGoal, useUpdateGoal } from '../hooks/useGoalMutations'
import { MAX_DAILY_GOALS } from '../types'
import { computeProgress } from '../utils'
import type { DailyGoal } from '../types'
import { GoalItem } from './GoalItem'

interface GoalListProps {
  goals: DailyGoal[]
  date: string
}

/** Liste der heutigen Tagesziele inkl. Fortschrittsanzeige und Hinzufügen-Formular (max. 5). */
export function GoalList({ goals, date }: GoalListProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const deleteMutation = useDeleteGoal()

  const { completed, total, percent } = computeProgress(goals)
  const canAddMore = goals.length < MAX_DAILY_GOALS

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
      await createMutation.mutateAsync({ title: trimmed, date, user_id: user.id })
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  function handleToggle(goal: DailyGoal) {
    updateMutation.mutate({ id: goal.id, goal: { completed: !goal.completed } })
  }

  function handleDelete(goal: DailyGoal) {
    deleteMutation.mutate(goal.id)
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-fg-secondary">Heute</h2>
        <span className="text-sm font-medium text-fg-secondary">
          {completed} von {total} erledigt
        </span>
      </div>

      <ProgressBar value={percent} />

      <div className="space-y-2">
        {goals.length === 0 ? (
          <p className="text-sm text-fg-tertiary">Noch keine Tagesziele für heute.</p>
        ) : (
          goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onToggle={handleToggle} onDelete={handleDelete} />
          ))
        )}
      </div>

      {canAddMore ? (
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Neues Tagesziel"
            aria-label="Neues Tagesziel"
          />
          <Button type="submit" disabled={createMutation.isPending || !title.trim()}>
            <Plus size={16} />
          </Button>
        </form>
      ) : (
        <p className="text-sm text-fg-tertiary">Maximal {MAX_DAILY_GOALS} Tagesziele erreicht.</p>
      )}

      {error && <p className="text-sm text-cal-red">{error}</p>}
    </div>
  )
}
