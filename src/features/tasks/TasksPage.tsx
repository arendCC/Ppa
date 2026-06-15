import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TaskDialog } from './components/TaskDialog'
import { TaskFilters } from './components/TaskFilters'
import { TaskItem } from './components/TaskItem'
import { useTasks } from './hooks/useTasks'
import { useUpdateTask } from './hooks/useTaskMutations'
import { RecurringTasksSection } from './recurring/components/RecurringTasksSection'
import { filterAndSortTasks, getTaskCategories, resolveCompletedAt } from './utils'
import type { Task, TaskPriority, TaskSortOption, TaskStatusFilter } from './types'

/** Aufgabenseite: Liste mit Filtern/Sortierung sowie Erstellen/Bearbeiten-Dialog. */
export function TasksPage() {
  const { data: tasks = [], isError } = useTasks()
  const updateMutation = useUpdateTask()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [status, setStatus] = useState<TaskStatusFilter>('all')
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<TaskSortOption>('dueDate')

  const categories = useMemo(() => getTaskCategories(tasks), [tasks])
  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, { status, priority, category }, sort),
    [tasks, status, priority, category, sort],
  )

  function handleNewTask() {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  function handleToggle(task: Task) {
    const completed = !task.completed
    updateMutation.mutate({ id: task.id, task: { completed, completed_at: resolveCompletedAt(completed, task) } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">Aufgaben</h1>
        <Button onClick={handleNewTask}>
          <Plus size={16} className="mr-1.5" />
          Neue Aufgabe
        </Button>
      </div>

      {isError && (
        <div className="rounded-xl border border-cal-red/30 bg-cal-red/10 px-4 py-2.5 text-sm text-cal-red">
          Aufgaben konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
        </div>
      )}

      <TaskFilters
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        sort={sort}
        onSortChange={setSort}
      />

      {visibleTasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 px-4 py-10 text-center text-sm text-fg-secondary">
          Keine Aufgaben gefunden.
        </p>
      ) : (
        <div className="space-y-2.5">
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onClick={handleTaskClick} />
          ))}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={selectedTask}
        categories={categories}
      />

      <div className="border-t border-border/60 pt-6">
        <RecurringTasksSection categories={categories} />
      </div>
    </div>
  )
}
