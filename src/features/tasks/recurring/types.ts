import type { Database, RecurrenceType } from '@/lib/supabase/types'

export type { RecurrenceType }

export type RecurringTask = Database['public']['Tables']['recurring_tasks']['Row']
export type RecurringTaskInsert = Database['public']['Tables']['recurring_tasks']['Insert']
export type RecurringTaskUpdate = Database['public']['Tables']['recurring_tasks']['Update']

export const DEFAULT_RECURRENCE_TYPE: RecurrenceType = 'daily'
export const DEFAULT_RECURRENCE_INTERVAL = 1

/** Werte des Formulars für wiederkehrende Aufgaben (Erstellen/Bearbeiten). */
export interface RecurringTaskFormValues {
  title: string
  description: string
  priority: import('../types').TaskPriority
  category: string
  recurrenceType: RecurrenceType
  recurrenceInterval: number
  nextDueDate: string
  active: boolean
}
