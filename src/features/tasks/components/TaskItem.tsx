import { clsx } from 'clsx'
import { format, isPast, isToday, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Calendar, Check, Repeat } from 'lucide-react'
import { taskPriorityClasses, taskPriorityLabels } from '../priority'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onClick: (task: Task) => void
}

/** Einzelne Aufgabenzeile mit Abhak-Button, Badges und Klick zum Bearbeiten. */
export function TaskItem({ task, onToggle, onClick }: TaskItemProps) {
  const dueDate = task.due_date ? parseISO(task.due_date) : null
  const overdue = !!dueDate && !task.completed && isPast(dueDate) && !isToday(dueDate)
  const priority = taskPriorityClasses[task.priority]

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-accent/50">
      <button
        type="button"
        aria-label={task.completed ? 'Als offen markieren' : 'Als erledigt markieren'}
        aria-pressed={task.completed}
        onClick={() => onToggle(task)}
        className={clsx(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          task.completed
            ? 'border-accent bg-accent text-white'
            : 'border-border text-transparent hover:border-accent',
        )}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <button type="button" onClick={() => onClick(task)} className="flex-1 text-left">
        <p className={clsx('text-sm font-medium text-fg', task.completed && 'text-fg-tertiary line-through')}>
          {task.title}
        </p>

        {task.description && (
          <p className={clsx('mt-0.5 line-clamp-2 text-sm text-fg-secondary', task.completed && 'text-fg-tertiary')}>
            {task.description}
          </p>
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
            {taskPriorityLabels[task.priority]}
          </span>

          {task.category && (
            <span className="inline-flex items-center rounded-full bg-surface-secondary px-2 py-0.5 font-medium text-fg-secondary">
              {task.category}
            </span>
          )}

          {dueDate && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 font-medium',
                overdue ? 'text-cal-red' : 'text-fg-secondary',
              )}
            >
              <Calendar size={12} />
              {format(dueDate, 'd. MMM yyyy', { locale: de })}
            </span>
          )}

          {task.recurring_task_id && (
            <span
              title="Wiederkehrende Aufgabe"
              aria-label="Wiederkehrende Aufgabe"
              className="inline-flex items-center gap-1 font-medium text-fg-secondary"
            >
              <Repeat size={12} />
            </span>
          )}
        </div>
      </button>
    </div>
  )
}
