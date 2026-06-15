import { addDays, format, parseISO } from 'date-fns'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useGoals } from '@/features/goals/hooks/useGoals'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useWeeklyGoals } from '@/features/weekly-goals/hooks/useWeeklyGoals'
import { STATS_WEEKS_HISTORY } from '../types'
import {
  buildProductivityTrend,
  computeDailyGoalAchievement,
  computeWeeklyGoalAchievement,
  countCompletedTasksByWeek,
  getRecentWeekStarts,
} from '../utils'
import { ChartCard } from './ChartCard'
import { ChartTooltip } from './ChartTooltip'

const axisTick = { fill: 'var(--fg-secondary)', fontSize: 12 }

/** Trend über erledigte Aufgaben und Zielerreichung der letzten Wochen. */
export function ProductivityTrendsChart() {
  const weekStarts = getRecentWeekStarts(STATS_WEEKS_HISTORY)
  const rangeStart = weekStarts[0]
  const lastWeekStart = weekStarts[weekStarts.length - 1]
  const rangeEnd = format(addDays(parseISO(lastWeekStart), 6), 'yyyy-MM-dd')

  const { data: tasks = [] } = useTasks()
  const { data: dailyGoals = [] } = useGoals(rangeStart, rangeEnd)
  const { data: weeklyGoals = [] } = useWeeklyGoals(rangeStart, lastWeekStart)

  const taskStats = countCompletedTasksByWeek(tasks, weekStarts)
  const dailyStats = computeDailyGoalAchievement(dailyGoals, weekStarts)
  const weeklyStats = computeWeeklyGoalAchievement(weeklyGoals, weekStarts)
  const trend = buildProductivityTrend(taskStats, dailyStats, weeklyStats)

  return (
    <ChartCard
      title="Produktivitätstrends"
      description={`Erledigte Aufgaben und Zielerreichung · letzte ${STATS_WEEKS_HISTORY} Wochen`}
      className="h-72"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trend} margin={{ left: -16, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
          <YAxis yAxisId="left" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            width={40}
            unit="%"
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--fg-secondary)' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="tasksCompleted"
            name="Erledigte Aufgaben"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dailyGoalsPercent"
            name="Tagesziele"
            unit="%"
            stroke="var(--color-cal-green)"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="weeklyGoalsPercent"
            name="Wochenziele"
            unit="%"
            stroke="var(--color-cal-purple)"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
