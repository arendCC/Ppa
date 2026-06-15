import { supabase } from '@/lib/supabase/client'
import type { Task, TaskInsert, TaskUpdate } from './types'

/** Lädt alle Aufgaben des angemeldeten Nutzers. */
export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createTask(task: TaskInsert): Promise<Task> {
  const { data, error } = await supabase.from('tasks').insert(task).select().single()
  if (error) throw error
  return data
}

export async function updateTask(id: string, task: TaskUpdate): Promise<Task> {
  const { data, error } = await supabase.from('tasks').update(task).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
