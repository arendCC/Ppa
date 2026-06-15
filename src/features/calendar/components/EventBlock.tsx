import { clsx } from 'clsx'
import { format } from 'date-fns'
import type { CSSProperties } from 'react'
import { eventColorClasses } from '../colors'
import type { CalendarEvent } from '../types'

interface EventBlockProps {
  event: CalendarEvent
  style?: CSSProperties
  onClick: (event: CalendarEvent) => void
}

/** Farbig markierter Termin-Block, absolut positioniert innerhalb einer Zeitraster-Spalte. */
export function EventBlock({ event, style, onClick }: EventBlockProps) {
  const colors = eventColorClasses[event.color]

  return (
    <button
      type="button"
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      className={clsx(
        'absolute min-h-[20px] overflow-hidden rounded-md border-l-[3px] px-1.5 py-0.5 text-left text-xs leading-tight transition-opacity hover:opacity-80',
        colors.bg,
        colors.border,
      )}
    >
      <p className="truncate font-medium text-fg">{event.title}</p>
      {!event.all_day && (
        <p className="truncate text-fg-secondary">{format(new Date(event.start_time), 'HH:mm')}</p>
      )}
    </button>
  )
}
