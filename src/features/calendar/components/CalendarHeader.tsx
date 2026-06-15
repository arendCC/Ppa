import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import type { CalendarView } from '../types'

interface CalendarHeaderProps {
  title: string
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onNewEvent: () => void
}

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'Tag' },
  { value: 'week', label: 'Woche' },
  { value: 'month', label: 'Monat' },
]

/** Navigation, Ansichtsumschalter und "Neuer Termin"-Button für die Kalenderseite. */
export function CalendarHeader({ title, view, onViewChange, onPrev, onNext, onToday, onNewEvent }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onToday}>
          Heute
        </Button>
        <div className="flex items-center">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Zurück"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-fg-secondary transition-colors hover:bg-surface-secondary hover:text-fg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Weiter"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-fg-secondary transition-colors hover:bg-surface-secondary hover:text-fg"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <h1 className="text-xl font-bold capitalize tracking-tight text-fg sm:text-2xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded-full bg-surface-secondary p-1">
          {VIEW_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => onViewChange(value)}
              className={clsx(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                view === value ? 'bg-accent-gradient text-white shadow-soft' : 'text-fg-secondary hover:text-fg',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <Button onClick={onNewEvent}>
          <Plus size={16} className="mr-1.5" />
          Neuer Termin
        </Button>
      </div>
    </div>
  )
}
