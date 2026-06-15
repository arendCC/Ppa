import { supabase } from '@/lib/supabase/client'
import type { WeeklyGoal, WeeklyGoalInsert, WeeklyGoalUpdate } from './types'

/** Lädt alle Wochenziele des angemeldeten Nutzers in einem Wochenstart-Bereich (inklusive). */
export async function fetchWeeklyGoals(rangeStart: string, rangeEnd: string): Promise<WeeklyGoal[]> {
  const { data, error } = await supabase
    .from('weekly_goals')
    .select('*')
    .gte('week_start', rangeStart)
    .lte('week_start', rangeEnd)
    .order('week_start', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createWeeklyGoal(goal: WeeklyGoalInsert): Promise<WeeklyGoal> {
  const { data, error } = await supabase.from('weekly_goals').insert(goal).select().single()
  if (error) throw error
  return data
}

export async function updateWeeklyGoal(id: string, goal: WeeklyGoalUpdate): Promise<WeeklyGoal> {
  const { data, error } = await supabase.from('weekly_goals').update(goal).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteWeeklyGoal(id: string): Promise<void> {
  const { error } = await supabase.from('weekly_goals').delete().eq('id', id)
  if (error) throw error
}

/** Markiert alle erledigten, noch nicht archivierten Wochenziele einer Woche als archiviert. */
export async function archiveCompletedWeeklyGoals(weekStart: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_goals')
    .update({ archived: true })
    .eq('week_start', weekStart)
    .eq('completed', true)
    .eq('archived', false)

  if (error) throw error
}
