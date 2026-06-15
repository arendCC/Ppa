import { addDays, format, parseISO } from 'date-fns'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useGoals } from '@/features/goals/hooks/useGoals'
import { useWeeklyGoals } from '@/features/weekly-goals/hooks/useWeeklyGoals'
import { STATS_WEEKS_HISTORY } from '../types'
import { computeDailyGoalAchievement, computeWeeklyGoalAchievement, getRecentWeekStarts } from '../utils'
import { ChartCard } from './ChartCard'
import { ChartTooltip } from './ChartTooltip'

const axisTick = { fill: 'var(--fg-secondary)', fontSize: 12 }

/** Zielerreichung (Anteil erledigter Tages- bzw. Wochenziele) pro Woche als Balkendiagramme. */
export function GoalAchievementSection() {
  const weekStarts = getRecentWeekStarts(STATS_WEEKS_HISTORY)
  const rangeStart = weekStarts[0]
  const lastWeekStart = weekStarts[weekStarts.length - 1]
  const rangeEnd = format(addDays(parseISO(lastWeekStart), 6), 'yyyy-MM-dd')

  const { data: dailyGoals = [] } = useGoals(rangeStart, rangeEnd)
  const { data: weeklyGoals = [] } = useWeeklyGoals(rangeStart, lastWeekStart)

  const dailyStats = computeDailyGoalAchievement(dailyGoals, weekStarts)
  const weeklyStats = computeWeeklyGoalAchievement(weeklyGoals, weekStarts)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Tagesziele – Zielerreichung" description={`Anteil erledigter Tagesziele pro Woche · letzte ${STATS_WEEKS_HISTORY} Wochen`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyStats} margin={{ left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} width={36} unit="%" />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-secondary)' }} />
            <Bar dataKey="percent" name="Erreicht" unit="%" fill="var(--color-cal-green)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Wochenziele – Zielerreichung" description={`Anteil erledigter Wochenziele · letzte ${STATS_WEEKS_HISTORY} Wochen`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyStats} margin={{ left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={axisTick} axisLine={false} tickLine={false} width={36} unit="%" />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-secondary)' }} />
            <Bar dataKey="percent" name="Erreicht" unit="%" fill="var(--color-cal-purple)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
