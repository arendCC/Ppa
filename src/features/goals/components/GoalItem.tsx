import { clsx } from 'clsx'
import { Check, X } from 'lucide-react'
import type { DailyGoal } from '../types'

interface GoalItemProps {
  goal: DailyGoal
  onToggle: (goal: DailyGoal) => void
  onDelete?: (goal: DailyGoal) => void
}

/** Einzelnes Tagesziel mit Abhak-Button und optionalem Löschen-Button. */
export function GoalItem({ goal, onToggle, onDelete }: GoalItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-secondary/50 px-3 py-2">
      <button
        type="button"
        aria-label={goal.completed ? 'Als offen markieren' : 'Als erledigt markieren'}
        aria-pressed={goal.completed}
        onClick={() => onToggle(goal)}
        className={clsx(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          goal.completed
            ? 'border-accent bg-accent text-white'
            : 'border-border text-transparent hover:border-accent',
        )}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <span className={clsx('flex-1 text-sm text-fg', goal.completed && 'text-fg-tertiary line-through')}>
        {goal.title}
      </span>

      {onDelete && (
        <button
          type="button"
          aria-label="Tagesziel löschen"
          onClick={() => onDelete(goal)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-fg-tertiary transition-colors hover:bg-surface hover:text-cal-red"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
