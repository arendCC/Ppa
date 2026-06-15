import { useEffect, useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/features/auth/AuthProvider'
import { TASK_PRIORITIES } from '../priority'
import { useCreateTask, useDeleteTask, useUpdateTask } from '../hooks/useTaskMutations'
import { DEFAULT_TASK_PRIORITY, type Task, type TaskFormValues, type TaskPriority } from '../types'
import { resolveCompletedAt } from '../utils'

interface TaskDialogProps {
  open: boolean
  onClose: () => void
  /** Bestehende Aufgabe zum Bearbeiten, oder null für eine neue Aufgabe. */
  task: Task | null
  /** Bereits verwendete Kategorien als Vorschläge. */
  categories: string[]
}

function buildFormValues(task: Task | null): TaskFormValues {
  if (task) {
    return {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      category: task.category ?? '',
      dueDate: task.due_date ?? '',
      completed: task.completed,
    }
  }

  return {
    title: '',
    description: '',
    priority: DEFAULT_TASK_PRIORITY,
    category: '',
    dueDate: '',
    completed: false,
  }
}

export function TaskDialog({ open, onClose, task, categories }: TaskDialogProps) {
  const { user } = useAuth()
  const [values, setValues] = useState<TaskFormValues>(() => buildFormValues(task))
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  useEffect(() => {
    if (open) {
      setValues(buildFormValues(task))
      setError(null)
    }
  }, [open, task])

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  function handleChange<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.title.trim()) {
      setError('Bitte gib einen Titel ein.')
      return
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      category: values.category.trim() || null,
      due_date: values.dueDate || null,
      completed: values.completed,
      completed_at: resolveCompletedAt(values.completed, task),
    }

    try {
      if (task) {
        await updateMutation.mutateAsync({ id: task.id, task: payload })
      } else {
        if (!user) throw new Error('Nicht angemeldet.')
        await createMutation.mutateAsync({ ...payload, user_id: user.id })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  async function handleDelete() {
    if (!task) return
    setError(null)
    try {
      await deleteMutation.mutateAsync(task.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Titel</label>
          <Input
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Titel"
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Beschreibung</label>
          <Textarea
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Optional"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Priorität</label>
            <Select
              value={values.priority}
              onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
              className="w-full"
            >
              {TASK_PRIORITIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Fälligkeitsdatum</label>
            <Input type="date" value={values.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Kategorie</label>
          <Input
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Optional"
            list="task-categories"
          />
          <datalist id="task-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <label className="flex items-center gap-2 text-sm text-fg">
          <input
            type="checkbox"
            checked={values.completed}
            onChange={(e) => handleChange('completed', e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Erledigt
        </label>

        {error && <p className="text-sm text-cal-red">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          {task ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
              className="text-cal-red hover:text-cal-red"
            >
              <Trash2 size={16} className="mr-1.5" />
              Löschen
            </Button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving || isDeleting}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSaving || isDeleting}>
              Speichern
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
