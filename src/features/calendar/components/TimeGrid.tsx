import { clsx } from 'clsx'
import { addMinutes, isSameDay, startOfDay } from 'date-fns'
import type { MouseEvent } from 'react'
import { GUTTER_WIDTH, HOUR_HEIGHT, SLOT_MINUTES, TOTAL_HEIGHT } from '../constants'
import { packIntervals } from '../utils/layout'
import { useNow } from '../utils/useNow'
import { EventBlock } from './EventBlock'
import type { CalendarEvent } from '../types'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export interface TimeSlotRange {
  start: Date
  end: Date
}

interface TimeGridProps {
  /** Anzuzeigende Tage (1 = Tagesansicht, 7 = Wochenansicht). */
  days: Date[]
  /** Nicht-ganztägige Termine, die in den sichtbaren Tagen liegen. */
  events: CalendarEvent[]
  onSlotClick: (range: TimeSlotRange) => void
  onEventClick: (event: CalendarEvent) => void
}

/** Stundenraster mit Zeitleiste, "Jetzt"-Linie und positionierten Terminen (Tag-/Wochenansicht). */
export function TimeGrid({ days, events, onSlotClick, onEventClick }: TimeGridProps) {
  const now = useNow()

  return (
    <div className="flex" style={{ minHeight: TOTAL_HEIGHT }}>
      <div className="shrink-0 select-none" style={{ width: GUTTER_WIDTH }}>
        {HOURS.map((hour) => (
          <div key={hour} style={{ height: HOUR_HEIGHT }} className="relative">
            {hour > 0 && (
              <span className="absolute right-2 top-0 -translate-y-1/2 text-xs text-fg-tertiary">{hour}:00</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
        {days.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            events={events.filter((event) => isSameDay(new Date(event.start_time), day))}
            now={now}
            onSlotClick={onSlotClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  )
}

interface DayColumnProps {
  day: Date
  events: CalendarEvent[]
  now: Date
  onSlotClick: TimeGridProps['onSlotClick']
  onEventClick: TimeGridProps['onEventClick']
}

function DayColumn({ day, events, now, onSlotClick, onEventClick }: DayColumnProps) {
  const dayStart = startOfDay(day)

  const positioned = packIntervals(
    events,
    (event) => new Date(event.start_time).getTime(),
    (event) => new Date(event.end_time).getTime(),
  )

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetY = e.clientY - rect.top
    const rawMinutes = (offsetY / HOUR_HEIGHT) * 60
    const minutes = Math.min(Math.max(0, Math.round(rawMinutes / SLOT_MINUTES) * SLOT_MINUTES), 23 * 60 + 30)
    const start = addMinutes(dayStart, minutes)
    const end = addMinutes(start, 60)
    onSlotClick({ start, end })
  }

  const isToday = isSameDay(day, now)
  const nowOffset = ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT

  return (
    <div
      className={clsx('relative cursor-pointer border-l border-border/60', isToday && 'bg-accent/[0.03]')}
      style={{ height: TOTAL_HEIGHT }}
      onClick={handleClick}
    >
      {HOURS.map((hour) => (
        <div key={hour} className="absolute inset-x-0 border-t border-border/60" style={{ top: hour * HOUR_HEIGHT }} />
      ))}

      {isToday && (
        <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: nowOffset }}>
          <div className="h-2 w-2 -translate-x-1/2 rounded-full bg-cal-red" />
          <div className="h-px flex-1 bg-cal-red" />
        </div>
      )}

      {positioned.map(({ item, index, count }) => {
        const start = new Date(item.start_time)
        const end = new Date(item.end_time)
        const startMinutes = Math.max(0, (start.getTime() - dayStart.getTime()) / 60_000)
        const endMinutes = Math.min(24 * 60, (end.getTime() - dayStart.getTime()) / 60_000)
        const top = (startMinutes / 60) * HOUR_HEIGHT
        const height = Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 20)
        const width = 100 / count
        const left = index * width

        return (
          <EventBlock
            key={item.id}
            event={item}
            onClick={onEventClick}
            style={{ top, height, left: `${left}%`, width: `calc(${width}% - 2px)` }}
          />
        )
      })}
    </div>
  )
}
