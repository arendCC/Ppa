import { addDays, addMonths, addWeeks, format, parseISO, startOfMonth } from 'date-fns'
import { de } from 'date-fns/locale'
import type { DailyGoal } from '@/features/goals/types'
import type { Task } from '@/features/tasks/types'
import { getWeekStart } from '@/features/weekly-goals/utils'
import type { WeeklyGoal } from '@/features/weekly-goals/types'
import type { GoalAchievementStat, MonthlyTaskStat, ProductivityTrendPoint, WeeklyTaskStat } from './types'

const DATE_FORMAT = 'yyyy-MM-dd'

/** Liefert die letzten `count` Wochenstarts (älteste zuerst), inklusive der aktuellen Woche. */
export function getRecentWeekStarts(count: number, date = new Date()): string[] {
  const currentWeekStart = parseISO(getWeekStart(date))
  return Array.from({ length: count }, (_, i) => format(addWeeks(currentWeekStart, -(count - 1 - i)), DATE_FORMAT))
}

/** Liefert die letzten `count` Monatsanfänge (älteste zuerst), inklusive des aktuellen Monats. */
export function getRecentMonthStarts(count: number, date = new Date()): string[] {
  const currentMonthStart = startOfMonth(date)
  return Array.from({ length: count }, (_, i) => format(addMonths(currentMonthStart, -(count - 1 - i)), DATE_FORMAT))
}

/** Zählt erledigte Aufgaben (anhand completed_at) pro Woche. */
export function countCompletedTasksByWeek(tasks: Task[], weekStarts: string[]): WeeklyTaskStat[] {
  const counts = new Map<string, number>(weekStarts.map((weekStart) => [weekStart, 0]))

  for (const task of tasks) {
    if (!task.completed_at) continue
    const weekStart = getWeekStart(parseISO(task.completed_at))
    if (counts.has(weekStart)) counts.set(weekStart, (counts.get(weekStart) ?? 0) + 1)
  }

  return weekStarts.map((weekStart) => ({
    weekStart,
    label: format(parseISO(weekStart), 'd. MMM', { locale: de }),
    completed: counts.get(weekStart) ?? 0,
  }))
}

/** Zählt erledigte Aufgaben (anhand completed_at) pro Monat. */
export function countCompletedTasksByMonth(tasks: Task[], monthStarts: string[]): MonthlyTaskStat[] {
  const counts = new Map<string, number>(monthStarts.map((month) => [month, 0]))

  for (const task of tasks) {
    if (!task.completed_at) continue
    const month = format(startOfMonth(parseISO(task.completed_at)), DATE_FORMAT)
    if (counts.has(month)) counts.set(month, (counts.get(month) ?? 0) + 1)
  }

  return monthStarts.map((month) => ({
    month,
    label: format(parseISO(month), 'MMM yyyy', { locale: de }),
    completed: counts.get(month) ?? 0,
  }))
}

/** Erreichungsgrad der Tagesziele pro Woche (Summe aller Tage der jeweiligen Woche). */
export function computeDailyGoalAchievement(goals: DailyGoal[], weekStarts: string[]): GoalAchievementStat[] {
  return weekStarts.map((weekStart) => {
    const weekEnd = format(addDays(parseISO(weekStart), 6), DATE_FORMAT)
    const weekGoals = goals.filter((goal) => goal.date >= weekStart && goal.date <= weekEnd)
    const completed = weekGoals.filter((goal) => goal.completed).length
    const total = weekGoals.length

    return {
      key: weekStart,
      label: format(parseISO(weekStart), 'd. MMM', { locale: de }),
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    }
  })
}

/** Erreichungsgrad der Wochenziele pro Woche. */
export function computeWeeklyGoalAchievement(goals: WeeklyGoal[], weekStarts: string[]): GoalAchievementStat[] {
  return weekStarts.map((weekStart) => {
    const weekGoals = goals.filter((goal) => goal.week_start === weekStart)
    const completed = weekGoals.filter((goal) => goal.completed).length
    const total = weekGoals.length

    return {
      key: weekStart,
      label: format(parseISO(weekStart), 'd. MMM', { locale: de }),
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    }
  })
}

/** Kombiniert erledigte Aufgaben und Zielerreichung pro Woche zu einer Trendreihe. */
export function buildProductivityTrend(
  taskStats: WeeklyTaskStat[],
  dailyGoalStats: GoalAchievementStat[],
  weeklyGoalStats: GoalAchievementStat[],
): ProductivityTrendPoint[] {
  return taskStats.map((taskStat, index) => ({
    label: taskStat.label,
    tasksCompleted: taskStat.completed,
    dailyGoalsPercent: dailyGoalStats[index]?.total ? dailyGoalStats[index].percent : null,
    weeklyGoalsPercent: weeklyGoalStats[index]?.total ? weeklyGoalStats[index].percent : null,
  }))
}
