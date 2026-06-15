import { clsx } from 'clsx'
import { differenceInCalendarDays } from 'date-fns'
import { GUTTER_WIDTH } from '../constants'
import { eventColorClasses } from '../colors'
import { packIntervals } from '../utils/layout'
import type { CalendarEvent } from '../types'

interface AllDayRowProps {
  days: Date[]
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

interface AllDaySpan {
  event: CalendarEvent
  startIndex: number
  endIndex: number
}

/** Leiste für ganztägige Termine oberhalb des Zeitrasters (Tages-/Wochenansicht). */
export function AllDayRow({ days, events, onEventClick }: AllDayRowProps) {
  if (events.length === 0) return null

  const rangeStart = days[0]

  const spans: AllDaySpan[] = events.map((event) => {
    const startIndex = Math.max(0, differenceInCalendarDays(new Date(event.start_time), rangeStart))
    const endIndex = Math.min(days.length - 1, differenceInCalendarDays(new Date(event.end_time), rangeStart))
    return { event, startIndex, endIndex: Math.max(startIndex, endIndex) }
  })

  const packed = packIntervals(
    spans,
    (span) => span.startIndex,
    (span) => span.endIndex + 1,
  )

  const rowCount = Math.max(...packed.map((p) => p.count), 1)

  return (
    <div className="flex border-b border-border/60 py-1">
      <div className="shrink-0" style={{ width: GUTTER_WIDTH }} />
      <div
        className="grid flex-1 gap-1 px-1"
        style={{
          gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, auto)`,
        }}
      >
        {packed.map(({ item, index }) => {
          const colors = eventColorClasses[item.event.color]
          return (
            <button
              key={item.event.id}
              type="button"
              onClick={() => onEventClick(item.event)}
              style={{
                gridColumn: `${item.startIndex + 1} / ${item.endIndex + 2}`,
                gridRow: index + 1,
              }}
              className={clsx(
                'truncate rounded-lg border-l-[3px] px-1.5 py-0.5 text-left text-xs font-medium text-fg transition-opacity hover:opacity-80',
                colors.bg,
                colors.border,
              )}
            >
              {item.event.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}
