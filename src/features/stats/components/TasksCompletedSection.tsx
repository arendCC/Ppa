import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { STATS_MONTHS_HISTORY, STATS_WEEKS_HISTORY } from '../types'
import { countCompletedTasksByMonth, countCompletedTasksByWeek, getRecentMonthStarts, getRecentWeekStarts } from '../utils'
import { ChartCard } from './ChartCard'
import { ChartTooltip } from './ChartTooltip'

const axisTick = { fill: 'var(--fg-secondary)', fontSize: 12 }

/** Erledigte Aufgaben pro Woche und pro Monat als Balkendiagramme. */
export function TasksCompletedSection() {
  const { data: tasks = [] } = useTasks()

  const weeklyStats = countCompletedTasksByWeek(tasks, getRecentWeekStarts(STATS_WEEKS_HISTORY))
  const monthlyStats = countCompletedTasksByMonth(tasks, getRecentMonthStarts(STATS_MONTHS_HISTORY))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Erledigte Aufgaben pro Woche" description={`Letzte ${STATS_WEEKS_HISTORY} Wochen`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyStats} margin={{ left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-secondary)' }} />
            <Bar dataKey="completed" name="Erledigt" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Erledigte Aufgaben pro Monat" description={`Letzte ${STATS_MONTHS_HISTORY} Monate`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats} margin={{ left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-secondary)' }} />
            <Bar dataKey="completed" name="Erledigt" fill="var(--color-accent-light)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
