import type { DailyGoal } from './types'

export interface GoalsProgress {
  completed: number
  total: number
  percent: number
}

/** Berechnet Fortschritt (erledigt/gesamt) für eine Liste von Tageszielen. */
export function computeProgress(goals: DailyGoal[]): GoalsProgress {
  const total = goals.length
  const completed = goals.filter((goal) => goal.completed).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, percent }
}

/** Gruppiert Tagesziele nach Datum, neuestes Datum zuerst. */
export function groupGoalsByDate(goals: DailyGoal[]): [string, DailyGoal[]][] {
  const groups = new Map<string, DailyGoal[]>()

  for (const goal of goals) {
    const list = groups.get(goal.date)
    if (list) {
      list.push(goal)
    } else {
      groups.set(goal.date, [goal])
    }
  }

  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}
