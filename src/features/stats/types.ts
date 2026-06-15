/** Anzahl Wochen, die in den Statistiken berücksichtigt werden. */
export const STATS_WEEKS_HISTORY = 8

/** Anzahl Monate, die in den Statistiken berücksichtigt werden. */
export const STATS_MONTHS_HISTORY = 6

export interface WeeklyTaskStat {
  weekStart: string
  label: string
  completed: number
}

export interface MonthlyTaskStat {
  month: string
  label: string
  completed: number
}

export interface GoalAchievementStat {
  key: string
  label: string
  percent: number
  completed: number
  total: number
}

export interface ProductivityTrendPoint {
  label: string
  tasksCompleted: number
  dailyGoalsPercent: number | null
  weeklyGoalsPercent: number | null
}
