import { addDays, format, parseISO, startOfWeek, subWeeks } from 'date-fns'
import { de } from 'date-fns/locale'
import type { WeeklyGoal } from './types'

export interface WeeklyGoalsProgress {
  completed: number
  total: number
  percent: number
}

const WEEK_START_FORMAT = 'yyyy-MM-dd'

/** Liefert den Montag der Kalenderwoche von `date` als 'yyyy-MM-dd'. */
export function getWeekStart(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), WEEK_START_FORMAT)
}

/** Liefert den Montag der Kalenderwoche `weeksAgo` Wochen vor `date` als 'yyyy-MM-dd'. */
export function getWeekStartWeeksAgo(date: Date, weeksAgo: number): string {
  return format(startOfWeek(subWeeks(date, weeksAgo), { weekStartsOn: 1 }), WEEK_START_FORMAT)
}

/** Formatiert eine Kalenderwoche (Montag-Sonntag) als lesbaren Zeitraum, z. B. "6.–12. Januar 2026". */
export function formatWeekRange(weekStart: string): string {
  const start = parseISO(weekStart)
  const end = addDays(start, 6)
  const startFormat = start.getMonth() === end.getMonth() ? 'd.' : 'd. MMMM'
  return `${format(start, startFormat, { locale: de })}–${format(end, 'd. MMMM yyyy', { locale: de })}`
}

/** Berechnet Fortschritt (erledigt/gesamt) für eine Liste von Wochenzielen. */
export function computeProgress(goals: WeeklyGoal[]): WeeklyGoalsProgress {
  const total = goals.length
  const completed = goals.filter((goal) => goal.completed).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, percent }
}

/** Gruppiert Wochenziele nach Wochenstart, neueste Woche zuerst. */
export function groupGoalsByWeek(goals: WeeklyGoal[]): [string, WeeklyGoal[]][] {
  const groups = new Map<string, WeeklyGoal[]>()

  for (const goal of goals) {
    const list = groups.get(goal.week_start)
    if (list) {
      list.push(goal)
    } else {
      groups.set(goal.week_start, [goal])
    }
  }

  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}
