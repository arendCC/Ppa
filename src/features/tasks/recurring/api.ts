import { supabase } from '@/lib/supabase/client'
import type { RecurringTask, RecurringTaskInsert, RecurringTaskUpdate } from './types'

/** Lädt alle wiederkehrenden Aufgaben-Vorlagen des angemeldeten Nutzers. */
export async function fetchRecurringTasks(): Promise<RecurringTask[]> {
  const { data, error } = await supabase
    .from('recurring_tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createRecurringTask(task: RecurringTaskInsert): Promise<RecurringTask> {
  const { data, error } = await supabase.from('recurring_tasks').insert(task).select().single()
  if (error) throw error
  return data
}

export async function updateRecurringTask(id: string, task: RecurringTaskUpdate): Promise<RecurringTask> {
  const { data, error } = await supabase.from('recurring_tasks').update(task).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteRecurringTask(id: string): Promise<void> {
  const { error } = await supabase.from('recurring_tasks').delete().eq('id', id)
  if (error) throw error
}

/** Erzeugt fällige Aufgaben aus aktiven Vorlagen und rückt deren Fälligkeitsdatum vor. */
export async function generateDueRecurringTasks(): Promise<void> {
  const { error } = await supabase.rpc('generate_due_recurring_tasks')
  if (error) throw error
}
