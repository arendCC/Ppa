import type { Database } from '@/lib/supabase/types'

export type DailyGoal = Database['public']['Tables']['daily_goals']['Row']
export type DailyGoalInsert = Database['public']['Tables']['daily_goals']['Insert']
export type DailyGoalUpdate = Database['public']['Tables']['daily_goals']['Update']

/** Maximale Anzahl an Tageszielen pro Tag. */
export const MAX_DAILY_GOALS = 5

/** Anzahl vergangener Tage, die in der Historie angezeigt werden. */
export const GOALS_HISTORY_DAYS = 14
