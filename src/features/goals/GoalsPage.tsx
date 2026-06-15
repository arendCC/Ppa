import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { de } from 'date-fns/locale'
import { GoalList } from './components/GoalList'
import { GoalsHistory } from './components/GoalsHistory'
import { useGoals } from './hooks/useGoals'
import { GOALS_HISTORY_DAYS } from './types'
import { groupGoalsByDate } from './utils'
import { WeeklyGoalList } from '@/features/weekly-goals/components/WeeklyGoalList'
import { WeeklyGoalsHistory } from '@/features/weekly-goals/components/WeeklyGoalsHistory'
import { useWeeklyGoals } from '@/features/weekly-goals/hooks/useWeeklyGoals'
import { WEEKLY_GOALS_HISTORY_WEEKS } from '@/features/weekly-goals/types'
import { getWeekStart, getWeekStartWeeksAgo, groupGoalsByWeek } from '@/features/weekly-goals/utils'

export function GoalsPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const historyStart = format(subDays(new Date(), GOALS_HISTORY_DAYS), 'yyyy-MM-dd')

  const { data: goals = [], isError } = useGoals(historyStart, today)

  const todayGoals = useMemo(() => goals.filter((goal) => goal.date === today), [goals, today])
  const historyDays = useMemo(
    () => groupGoalsByDate(goals.filter((goal) => goal.date !== today)),
    [goals, today],
  )

  const currentWeekStart = getWeekStart(new Date())
  const weeklyHistoryStart = getWeekStartWeeksAgo(new Date(), WEEKLY_GOALS_HISTORY_WEEKS)

  const { data: weeklyGoals = [], isError: isWeeklyError } = useWeeklyGoals(weeklyHistoryStart, currentWeekStart)

  const currentWeekGoals = useMemo(
    () => weeklyGoals.filter((goal) => goal.week_start === currentWeekStart && !goal.archived),
    [weeklyGoals, currentWeekStart],
  )
  const weeklyHistoryWeeks = useMemo(
    () =>
      groupGoalsByWeek(
        weeklyGoals.filter((goal) => goal.week_start !== currentWeekStart || goal.archived),
      ),
    [weeklyGoals, currentWeekStart],
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Ziele</h1>
        <p className="text-fg-secondary">{format(new Date(), 'EEEE, d. MMMM yyyy', { locale: de })}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Tagesziele</h2>

        {isError && (
          <div className="rounded-lg border border-cal-red/30 bg-cal-red/10 px-3 py-2 text-sm text-cal-red">
            Tagesziele konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
          </div>
        )}

        <GoalList goals={todayGoals} date={today} />

        <GoalsHistory days={historyDays} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Wochenziele</h2>

        {isWeeklyError && (
          <div className="rounded-lg border border-cal-red/30 bg-cal-red/10 px-3 py-2 text-sm text-cal-red">
            Wochenziele konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
          </div>
        )}

        <WeeklyGoalList goals={currentWeekGoals} weekStart={currentWeekStart} />

        <WeeklyGoalsHistory weeks={weeklyHistoryWeeks} />
      </section>
    </div>
  )
}
