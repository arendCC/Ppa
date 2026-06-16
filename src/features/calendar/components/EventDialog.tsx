import { useEffect, useState, type FormEvent } from 'react'
import { clsx } from 'clsx'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/features/auth/AuthProvider'
import { EVENT_COLORS, eventColorClasses } from '../colors'
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from '../hooks/useEventMutations'
import { DEFAULT_EVENT_COLOR, type CalendarEvent, type EventFormValues } from '../types'

export interface InitialEventRange {
  start: Date
  end: Date
  allDay?: boolean
}

interface EventDialogProps {
  open: boolean
  onClose: () => void
  /** Bestehender Termin zum Bearbeiten, oder null für einen neuen Termin. */
  event: CalendarEvent | null
  /** Vorausgefüllter Zeitraum für neue Termine (z. B. Klick auf einen Zeitslot). */
  initialRange?: InitialEventRange | null
}

function toDateInput(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

function toTimeInput(date: Date): string {
  return format(date, 'HH:mm')
}

function buildFormValues(event: CalendarEvent | null, initialRange?: InitialEventRange | null): EventFormValues {
  if (event) {
    const start = new Date(event.start_time)
    const end = new Date(event.end_time)
    return {
      title: event.title,
      description: event.description ?? '',
      location: event.location ?? '',
      allDay: event.all_day,
      startDate: toDateInput(start),
      startTime: toTimeInput(start),
      endDate: toDateInput(end),
      endTime: toTimeInput(end),
      color: event.color,
    }
  }

  const start = initialRange?.start ?? new Date()
  const end = initialRange?.end ?? new Date(start.getTime() + 60 * 60 * 1000)

  return {
    title: '',
    description: '',
    location: '',
    allDay: initialRange?.allDay ?? false,
    startDate: toDateInput(start),
    startTime: toTimeInput(start),
    endDate: toDateInput(end),
    endTime: toTimeInput(end),
    color: DEFAULT_EVENT_COLOR,
  }
}

export function EventDialog({ open, onClose, event, initialRange }: EventDialogProps) {
  const { user } = useAuth()
  const [values, setValues] = useState<EventFormValues>(() => buildFormValues(event, initialRange))
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateEvent()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  useEffect(() => {
    if (open) {
      setValues(buildFormValues(event, initialRange))
      setError(null)
    }
  }, [open, event, initialRange])

  const isSaving = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  function handleChange<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value }
      // Enddatum/-zeit automatisch nachziehen wenn Start > End
      if (key === 'startDate' && value > prev.endDate) {
        next.endDate = value as string
      }
      if (key === 'startDate' && value === prev.endDate && prev.startTime >= prev.endTime) {
        next.endTime = prev.startTime
      }
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.title.trim()) {
      setError('Bitte gib einen Titel ein.')
      return
    }

    const startTime = values.allDay
      ? new Date(`${values.startDate}T00:00:00`)
      : new Date(`${values.startDate}T${values.startTime}:00`)
    const endTime = values.allDay
      ? new Date(`${values.endDate}T23:59:59`)
      : new Date(`${values.endDate}T${values.endTime}:00`)

    if (endTime < startTime) {
      setError('Das Ende darf nicht vor dem Start liegen.')
      return
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      location: values.location.trim() || null,
      all_day: values.allDay,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      color: values.color,
    }

    try {
      if (event) {
        await updateMutation.mutateAsync({ id: event.id, event: payload })
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
    if (!event) return
    setError(null)
    try {
      await deleteMutation.mutateAsync(event.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={event ? 'Termin bearbeiten' : 'Neuer Termin'}>
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

        <label className="flex items-center gap-2 text-sm text-fg">
          <input
            type="checkbox"
            checked={values.allDay}
            onChange={(e) => handleChange('allDay', e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Ganztägig
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Beginn</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={values.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
              {!values.allDay && (
                <Input
                  type="time"
                  value={values.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className="w-32 px-2"
                />
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-fg-secondary">Ende</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={values.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
              {!values.allDay && (
                <Input
                  type="time"
                  value={values.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className="w-32 px-2"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Ort</label>
          <Input
            value={values.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Notizen</label>
          <Textarea
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Optional"
            rows={3}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-fg-secondary">Farbe</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_COLORS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={values.color === value}
                onClick={() => handleChange('color', value)}
                className={clsx(
                  'h-7 w-7 rounded-full transition-transform',
                  eventColorClasses[value].dot,
                  values.color === value && 'scale-110 ring-2 ring-accent ring-offset-2 ring-offset-surface',
                )}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-cal-red">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          {event ? (
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
