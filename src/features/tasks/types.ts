import type { Database, TaskPriority } from '@/lib/supabase/types'

export type { TaskPriority }

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export const DEFAULT_TASK_PRIORITY: TaskPriority = 'medium'

export type TaskStatusFilter = 'all' | 'open' | 'done'

export type TaskSortOption = 'dueDate' | 'priority' | 'title' | 'createdAt'

/** Werte des Aufgaben-Formulars (Erstellen/Bearbeiten). */
export interface TaskFormValues {
  title: string
  description: string
  priority: TaskPriority
  category: string
  dueDate: string
  completed: boolean
}
