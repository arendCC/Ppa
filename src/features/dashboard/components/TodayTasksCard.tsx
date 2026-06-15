import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { TaskItem } from '@/features/tasks/components/TaskItem'
import { TASK_PRIORITY_RANK } from '@/features/tasks/priority'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useUpdateTask } from '@/features/tasks/hooks/useTaskMutations'
import { resolveCompletedAt } from '@/features/tasks/utils'
import type { Task } from '@/features/tasks/types'

/** Dashboard-Karte: heute fällige und überfällige, noch offene Aufgaben. */
export function TodayTasksCard() {
  const navigate = useNavigate()
  const { data: tasks = [] } = useTasks()
  const updateMutation = useUpdateTask()

  const today = format(new Date(), 'yyyy-MM-dd')
  const dueTasks = tasks
    .filter((task) => !task.completed && !!task.due_date && task.due_date <= today)
    .sort((a, b) => {
      if (a.due_date !== b.due_date) return (a.due_date ?? '').localeCompare(b.due_date ?? '')
      return TASK_PRIORITY_RANK[b.priority] - TASK_PRIORITY_RANK[a.priority]
    })

  function handleToggle(task: Task) {
    const completed = !task.completed
    updateMutation.mutate({ id: task.id, task: { completed, completed_at: resolveCompletedAt(completed, task) } })
  }

  return (
    <Card hover className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-fg">Heutige Aufgaben</h2>
        <Link to="/tasks" className="text-sm font-medium text-accent transition-colors hover:text-accent-strong">
          Alle ansehen
        </Link>
      </div>

      <div className="space-y-2">
        {dueTasks.length === 0 ? (
          <p className="text-sm text-fg-tertiary">Keine Aufgaben für heute fällig.</p>
        ) : (
          dueTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onClick={() => navigate('/tasks')} />
          ))
        )}
      </div>
    </Card>
  )
}
