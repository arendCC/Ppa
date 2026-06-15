import { clsx } from 'clsx'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Calendar, Repeat } from 'lucide-react'
import { taskPriorityClasses, taskPriorityLabels } from '../../priority'
import { describeRecurrence } from '../recurrence'
import type { RecurringTask } from '../types'

interface RecurringTaskItemProps {
  recurringTask: RecurringTask
  onToggleActive: (recurringTask: RecurringTask) => void
  onClick: (recurringTask: RecurringTask) => void
}

/** Einzelne Vorlage für wiederkehrende Aufgaben mit Aktiv-Umschalter und Klick zum Bearbeiten. */
export function RecurringTaskItem({ recurringTask, onToggleActive, onClick }: RecurringTaskItemProps) {
  const priority = taskPriorityClasses[recurringTask.priority]
  const nextDueDate = parseISO(recurringTask.next_due_date)

  return (
    <div
      className={clsx(
        'card-hover flex items-start gap-3 rounded-2xl border border-border/60 bg-surface p-4 shadow-soft transition-colors hover:border-accent/40',
        !recurringTask.active && 'opacity-60',
      )}
    >
      <button
        type="button"
        aria-label={recurringTask.active ? 'Pausieren' : 'Aktivieren'}
        aria-pressed={recurringTask.active}
        onClick={() => onToggleActive(recurringTask)}
        className={clsx(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          recurringTask.active
            ? 'border-accent bg-accent-gradient text-white'
            : 'border-border text-transparent hover:border-accent',
        )}
      >
        <Repeat size={11} strokeWidth={3} />
      </button>

      <button type="button" onClick={() => onClick(recurringTask)} className="flex-1 text-left">
        <p className={clsx('text-sm font-medium text-fg', !recurringTask.active && 'text-fg-tertiary')}>
          {recurringTask.title}
        </p>

        {recurringTask.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-fg-secondary">{recurringTask.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
              priority.bg,
              priority.text,
            )}
          >
            <span className={clsx('h-1.5 w-1.5 rounded-full', priority.dot)} />
            {taskPriorityLabels[recurringTask.priority]}
          </span>

          {recurringTask.category && (
            <span className="inline-flex items-center rounded-full bg-surface-secondary px-2 py-0.5 font-medium text-fg-secondary">
              {recurringTask.category}
            </span>
          )}

          <span className="inline-flex items-center gap-1 font-medium text-fg-secondary">
            <Repeat size={12} />
            {describeRecurrence(recurringTask.recurrence_type, recurringTask.recurrence_interval)}
          </span>

          <span className="inline-flex items-center gap-1 font-medium text-fg-secondary">
            <Calendar size={12} />
            Nächste: {format(nextDueDate, 'd. MMM yyyy', { locale: de })}
          </span>
        </div>
      </button>
    </div>
  )
}
