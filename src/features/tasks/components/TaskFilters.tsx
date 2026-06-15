import { clsx } from 'clsx'
import { Select } from '@/components/ui/Select'
import { TASK_PRIORITIES } from '../priority'
import type { TaskPriority, TaskSortOption, TaskStatusFilter } from '../types'

interface TaskFiltersProps {
  status: TaskStatusFilter
  onStatusChange: (status: TaskStatusFilter) => void
  priority: TaskPriority | 'all'
  onPriorityChange: (priority: TaskPriority | 'all') => void
  category: string
  onCategoryChange: (category: string) => void
  categories: string[]
  sort: TaskSortOption
  onSortChange: (sort: TaskSortOption) => void
}

const STATUS_OPTIONS: { value: TaskStatusFilter; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'open', label: 'Offen' },
  { value: 'done', label: 'Erledigt' },
]

const SORT_OPTIONS: { value: TaskSortOption; label: string }[] = [
  { value: 'dueDate', label: 'Fälligkeitsdatum' },
  { value: 'priority', label: 'Priorität' },
  { value: 'title', label: 'Titel' },
  { value: 'createdAt', label: 'Erstellungsdatum' },
]

/** Status-Umschalter sowie Filter- und Sortier-Dropdowns für die Aufgabenliste. */
export function TaskFilters({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
  categories,
  sort,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex items-center gap-1 rounded-full bg-surface-secondary p-1">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            onClick={() => onStatusChange(value)}
            className={clsx(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              status === value ? 'bg-accent-gradient text-white shadow-soft' : 'text-fg-secondary hover:text-fg',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={priority} onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}>
          <option value="all">Alle Prioritäten</option>
          {TASK_PRIORITIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Alle Kategorien</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>

        <Select value={sort} onChange={(e) => onSortChange(e.target.value as TaskSortOption)}>
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
