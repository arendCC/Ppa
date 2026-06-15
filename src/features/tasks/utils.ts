import { TASK_PRIORITY_RANK } from './priority'
import type { Task, TaskPriority, TaskSortOption, TaskStatusFilter } from './types'

/** Bestimmt `completed_at` beim Setzen des Erledigt-Status: Zeitstempel beim Abschließen, sonst null. */
export function resolveCompletedAt(completed: boolean, previousTask: Task | null): string | null {
  if (!completed) return null
  if (previousTask?.completed) return previousTask.completed_at
  return new Date().toISOString()
}

/** Ermittelt alle in den Aufgaben verwendeten Kategorien, alphabetisch sortiert. */
export function getTaskCategories(tasks: Task[]): string[] {
  const categories = new Set<string>()
  for (const task of tasks) {
    if (task.category) categories.add(task.category)
  }
  return [...categories].sort((a, b) => a.localeCompare(b, 'de'))
}

export interface TaskFilterValues {
  status: TaskStatusFilter
  priority: TaskPriority | 'all'
  category: string
}

/** Filtert und sortiert Aufgaben; erledigte Aufgaben stehen dabei immer am Ende. */
export function filterAndSortTasks(tasks: Task[], filters: TaskFilterValues, sort: TaskSortOption): Task[] {
  const filtered = tasks.filter((task) => {
    if (filters.status === 'open' && task.completed) return false
    if (filters.status === 'done' && !task.completed) return false
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false
    if (filters.category !== 'all' && task.category !== filters.category) return false
    return true
  })

  return filtered.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1

    switch (sort) {
      case 'dueDate':
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return a.due_date.localeCompare(b.due_date)
      case 'priority':
        return TASK_PRIORITY_RANK[b.priority] - TASK_PRIORITY_RANK[a.priority]
      case 'title':
        return a.title.localeCompare(b.title, 'de')
      case 'createdAt':
        return b.created_at.localeCompare(a.created_at)
      default:
        return 0
    }
  })
}
