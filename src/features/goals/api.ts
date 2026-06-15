import { supabase } from '@/lib/supabase/client'
import type { DailyGoal, DailyGoalInsert, DailyGoalUpdate } from './types'

/** Lädt alle Tagesziele des angemeldeten Nutzers in einem Datumsbereich (inklusive). */
export async function fetchGoals(rangeStart: string, rangeEnd: string): Promise<DailyGoal[]> {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .gte('date', rangeStart)
    .lte('date', rangeEnd)
    .order('date', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createGoal(goal: DailyGoalInsert): Promise<DailyGoal> {
  const { data, error } = await supabase.from('daily_goals').insert(goal).select().single()
  if (error) throw error
  return data
}

export async function updateGoal(id: string, goal: DailyGoalUpdate): Promise<DailyGoal> {
  const { data, error } = await supabase.from('daily_goals').update(goal).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('daily_goals').delete().eq('id', id)
  if (error) throw error
}
