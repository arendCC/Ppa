import type { Database } from '@/lib/supabase/types'

export type WeeklyGoal = Database['public']['Tables']['weekly_goals']['Row']
export type WeeklyGoalInsert = Database['public']['Tables']['weekly_goals']['Insert']
export type WeeklyGoalUpdate = Database['public']['Tables']['weekly_goals']['Update']

/** Anzahl vergangener Wochen, die in der Historie angezeigt werden. */
export const WEEKLY_GOALS_HISTORY_WEEKS = 8
