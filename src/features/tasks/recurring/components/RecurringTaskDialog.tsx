import { useEffect, useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/features/auth/AuthProvider'
import { TASK_PRIORITIES } from '../../priority'
import { DEFAULT_TASK_PRIORITY, type TaskPriority } from '../../types'
import { RECURRENCE_TYPES } from '../recurrence'
import {
  useCreateRecurringTask,
  useDeleteRecurringTask,
  useUpdateRecurringTask,
} from '../hooks/useRecurringTaskMutations'
import {
  DEFAULT_RECURRENCE_INTERVAL,
  DEFAULT_RECURRENCE_TYPE,
  type RecurringTask,
  type RecurringTaskFormValues,
  type RecurrenceType,
} from '../types'

interface RecurringTaskDialogProps {
  open: boolean
  onClose: () => void
  /** Bestehende Vorlage zum Bearbeiten, oder null für eine neue Vorlage. */
  recurringTask: RecurringTask | null
  /** Bereits verwendete Kategorien als Vorschläge. */
  categories: string[]
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function buildFormValues(recurringTask: RecurringTask | null): RecurringTaskFormValues {
  if (recurringTask) {
    return {
      title: recurringTask.title,
      description: recurringTask.description ?? '',
      priority: recurringTask.priority,
      category: recurringTask.category ?? '',
      recurrenceType: recurringTask.recurrence_type,
      recurrenceInterval: recurringTask.recurrence_interval,
      nextDueDate: recurringTask.next_due_date,
      active: recurringTask.active,
    }
  }

  return {
    title: '',
    description: '',
    priority: DEFAULT_TASK_PRIORITY,
    category: '',
    recurrenceType: DEFAULT_RECURRENCE_TYPE,
    recurrenceInterval: DEFAULT_RECURRENCE_INTERVAL,
    nextDueDate: todayIso(),
    active: true,
  }
}

/** Dialog zum Erstellen/Bearbeiten einer Vorlage für wiederkehrende Aufgaben. */
export function RecurringTaskDialog({ open, onClose, recurringTask, categories }: RecurringTaskDialogProps) {
  const { user } = useAuth()
  const [values, setValues] = useState<RecurringTaskFormValues>(() => buildFormValues(recurringTask))
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateRecurringTask()
  const updateMutation = useUpdateRecurringTask()
  const deleteMutation = useDeleteRecurringTask()

  useEffect(() => {
    if (open) {
      setValues(buildFormValues(recurringTask))
      setError(null)
    }
  }, [open, recurringTask])

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  function handleChange<K extends keyof RecurringTaskFormValues>(key: K, value: RecurringTaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.title.trim()) {
      setError('Bitte gib einen Titel ein.')
      return
    }

    if (!values.nextDueDate) {
      setError('Bitte gib ein Startdatum an.')
      return
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      category: values.category.trim() || null,
      recurrence_type: values.recurrenceType,
      recurrence_interval: values.recurrenceType === 'custom' ? Math.max(1, values.recurrenceInterval) : 1,
      next_due_date: values.nextDueDate,
      active: values.active,
    }

    try {
      if (recurringTask) {
        await updateMutation.mutateAsync({ id: recurringTask.id, task: payload })
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
    if (!recurringTask) return
    setError(null)
    try {
      await deleteMutation.mutateAsync(recurringTask.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={recurringTask ? 'Wiederkehrende Aufgabe bearbeiten' : 'Neue wiederkehrende Aufgabe'}
    >
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
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Kategorie</label>
            <Input
              value={values.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Optional"
              list="recurring-task-categories"
            />
            <datalist id="recurring-task-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Wiederholung</label>
            <Select
              value={values.recurrenceType}
              onChange={(e) => handleChange('recurrenceType', e.target.value as RecurrenceType)}
              className="w-full"
            >
              {RECURRENCE_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Nächstes Fälligkeitsdatum</label>
            <Input
              type="date"
              value={values.nextDueDate}
              onChange={(e) => handleChange('nextDueDate', e.target.value)}
            />
          </div>
        </div>

        {values.recurrenceType === 'custom' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Alle wie viele Tage?</label>
            <Input
              type="number"
              min={1}
              value={values.recurrenceInterval}
              onChange={(e) => handleChange('recurrenceInterval', Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-fg">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => handleChange('active', e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Aktiv
        </label>

        {error && <p className="text-sm text-cal-red">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          {recurringTask ? (
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
