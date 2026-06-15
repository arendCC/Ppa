import { clsx } from 'clsx'
import { Check } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { computeProgress, formatWeekRange } from '../utils'
import type { WeeklyGoal } from '../types'

interface WeeklyGoalsHistoryProps {
  /** Wochenziele vergangener bzw. archivierter Wochen, gruppiert nach Wochenstart (neueste zuerst). */
  weeks: [string, WeeklyGoal[]][]
}

/** Historie vergangener Wochen mit Fortschritt und archivierten Wochenzielen. */
export function WeeklyGoalsHistory({ weeks }: WeeklyGoalsHistoryProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-fg-secondary">Historie</h3>

      {weeks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-fg-secondary">
          Noch keine vergangenen Wochenziele.
        </p>
      ) : (
        <div className="space-y-2">
          {weeks.map(([weekStart, goals]) => {
            const { completed, total, percent } = computeProgress(goals)

            return (
              <div key={weekStart} className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-fg">{formatWeekRange(weekStart)}</span>
                  <span className="text-xs font-medium text-fg-secondary">
                    {completed} von {total}
                  </span>
                </div>

                <ProgressBar value={percent} className="mt-2" />

                <ul className="mt-2 space-y-1">
                  {goals.map((goal) => (
                    <li key={goal.id} className="flex items-center gap-2 text-sm">
                      {goal.completed ? (
                        <Check size={14} className="shrink-0 text-accent" />
                      ) : (
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-border" />
                      )}
                      <span
                        className={clsx(
                          'text-fg-secondary',
                          goal.completed && 'text-fg-tertiary line-through',
                        )}
                      >
                        {goal.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
