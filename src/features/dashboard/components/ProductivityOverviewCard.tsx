import { format } from 'date-fns'
import { AlertTriangle, CalendarCheck, CheckCircle2, ListTodo, Target } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from '@/components/ui/Card'
import { useGoals } from '@/features/goals/hooks/useGoals'
import { computeProgress as computeDailyProgress } from '@/features/goals/utils'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useWeeklyGoals } from '@/features/weekly-goals/hooks/useWeeklyGoals'
import { computeProgress as computeWeeklyProgress, getWeekStart } from '@/features/weekly-goals/utils'

/** Dashboard-Karte: Kennzahlen zur Produktivität (Aufgaben, Ziele, Rückstände). */
export function ProductivityOverviewCard() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = getWeekStart(new Date())

  const { data: tasks = [] } = useTasks()
  const { data: dailyGoals = [] } = useGoals(today, today)
  const { data: weeklyGoals = [] } = useWeeklyGoals(weekStart, weekStart)

  const openTasks = tasks.filter((task) => !task.completed)
  const overdueTasks = openTasks.filter((task) => !!task.due_date && task.due_date < today)
  const todayTasks = tasks.filter((task) => task.due_date === today)
  const todayCompleted = todayTasks.filter((task) => task.completed).length

  const dailyProgress = computeDailyProgress(dailyGoals)
  const weeklyProgress = computeWeeklyProgress(weeklyGoals.filter((goal) => !goal.archived))

  const stats = [
    {
      icon: CalendarCheck,
      label: 'Aufgaben heute',
      value: todayTasks.length > 0 ? `${todayCompleted} / ${todayTasks.length}` : '–',
      hint: todayTasks.length > 0 ? 'erledigt' : 'Keine fällig',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Target,
      label: 'Tagesziele',
      value: dailyProgress.total > 0 ? `${dailyProgress.percent}%` : '–',
      hint: dailyProgress.total > 0 ? `${dailyProgress.completed} von ${dailyProgress.total} erledigt` : 'Keine Ziele',
      color: 'bg-cal-indigo/10 text-cal-indigo',
    },
    {
      icon: CheckCircle2,
      label: 'Wochenziele',
      value: weeklyProgress.total > 0 ? `${weeklyProgress.percent}%` : '–',
      hint: weeklyProgress.total > 0 ? `${weeklyProgress.completed} von ${weeklyProgress.total} erledigt` : 'Keine Ziele',
      color: 'bg-cal-green/10 text-cal-green',
    },
    {
      icon: ListTodo,
      label: 'Offene Aufgaben',
      value: String(openTasks.length),
      hint: 'gesamt',
      color: 'bg-cal-orange/10 text-cal-orange',
    },
    {
      icon: AlertTriangle,
      label: 'Überfällig',
      value: String(overdueTasks.length),
      hint: overdueTasks.length > 0 ? 'benötigen Aufmerksamkeit' : 'Alles im Plan',
      color: 'bg-cal-red/10 text-cal-red',
    },
  ]

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-fg">Produktivitätsübersicht</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map(({ icon: Icon, label, value, hint, color }) => (
          <div key={label} className="rounded-xl bg-surface-secondary p-4 transition-colors">
            <div className={clsx('flex h-9 w-9 items-center justify-center rounded-xl', color)}>
              <Icon size={18} />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-fg">{value}</p>
            <p className="text-sm font-medium text-fg-secondary">{label}</p>
            <p className="text-xs text-fg-tertiary">{hint}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
