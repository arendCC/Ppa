import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { format, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { GUTTER_WIDTH, HOUR_HEIGHT } from '../constants'
import { AllDayRow } from './AllDayRow'
import { TimeGrid, type TimeSlotRange } from './TimeGrid'
import type { CalendarEvent } from '../types'

interface CalendarGridViewProps {
  days: Date[]
  events: CalendarEvent[]
  onSlotClick: (range: TimeSlotRange) => void
  onEventClick: (event: CalendarEvent) => void
}

/** Gemeinsame Darstellung für Tages- und Wochenansicht: Tagesköpfe, Ganztags-Leiste, Zeitraster. */
export function CalendarGridView({ days, events, onSlotClick, onEventClick }: CalendarGridViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const today = new Date()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: HOUR_HEIGHT * 7 })
  }, [])

  const allDayEvents = events.filter((event) => event.all_day)
  const timedEvents = events.filter((event) => !event.all_day)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex border-b border-border">
        <div className="shrink-0" style={{ width: GUTTER_WIDTH }} />
        <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
          {days.map((day) => (
            <div key={day.toISOString()} className="border-l border-border px-1 py-2 text-center">
              <p className="text-xs text-fg-secondary">{format(day, 'EEE', { locale: de })}</p>
              <p
                className={clsx(
                  'mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                  isSameDay(day, today) ? 'bg-accent text-white' : 'text-fg',
                )}
              >
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AllDayRow days={days} events={allDayEvents} onEventClick={onEventClick} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <TimeGrid days={days} events={timedEvents} onSlotClick={onSlotClick} onEventClick={onEventClick} />
      </div>
    </div>
  )
}
