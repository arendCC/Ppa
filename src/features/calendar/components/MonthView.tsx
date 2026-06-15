import { clsx } from 'clsx'
import { endOfDay, format, isSameDay, isSameMonth, startOfDay } from 'date-fns'
import { eventColorClasses } from '../colors'
import type { CalendarEvent } from '../types'

const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MAX_VISIBLE_EVENTS = 3

interface MonthViewProps {
  /** Vollständiges Wochenraster (Vielfaches von 7 Tagen). */
  days: Date[]
  /** Referenzmonat, um Tage außerhalb des Monats abzugrenzen. */
  month: Date
  events: CalendarEvent[]
  onDayClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

function isEventOnDay(event: CalendarEvent, day: Date): boolean {
  const start = new Date(event.start_time)
  const end = new Date(event.end_time)
  return start <= endOfDay(day) && end >= startOfDay(day)
}

/** Monatsraster mit farbigen Termin-Chips pro Tag. */
export function MonthView({ days, month, events, onDayClick, onEventClick }: MonthViewProps) {
  const today = new Date()

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-soft">
      <div className="grid grid-cols-7 border-b border-border/60">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-l border-border/60 px-2 py-2.5 text-center text-xs font-medium text-fg-secondary [&:nth-child(7n+1)]:border-l-0"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        className="grid flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${days.length / 7}, minmax(0, 1fr))` }}
      >
        {days.map((day) => {
          const dayEvents = events
            .filter((event) => isEventOnDay(event, day))
            .sort((a, b) => {
              if (a.all_day !== b.all_day) return a.all_day ? -1 : 1
              return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            })

          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS)
          const hiddenCount = dayEvents.length - visibleEvents.length
          const inCurrentMonth = isSameMonth(day, month)
          const isToday = isSameDay(day, today)

          return (
            <div
              key={day.toISOString()}
              role="button"
              tabIndex={0}
              onClick={() => onDayClick(day)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onDayClick(day)
              }}
              className={clsx(
                'flex min-h-[5rem] cursor-pointer flex-col gap-1 border-l border-t border-border/60 p-1 text-left transition-colors [&:nth-child(7n+1)]:border-l-0 sm:p-1.5',
                inCurrentMonth ? 'hover:bg-surface-secondary/60' : 'bg-surface-secondary/40',
              )}
            >
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isToday ? 'bg-accent-gradient text-white shadow-soft' : inCurrentMonth ? 'text-fg' : 'text-fg-tertiary',
                )}
              >
                {format(day, 'd')}
              </span>

              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                {visibleEvents.map((event) => {
                  const colors = eventColorClasses[event.color]
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className={clsx(
                        'truncate rounded-md px-1 py-0.5 text-left text-[11px] font-medium transition-opacity hover:opacity-80',
                        colors.bg,
                        colors.text,
                      )}
                    >
                      {!event.all_day && (
                        <span className="text-fg-tertiary">{format(new Date(event.start_time), 'HH:mm')} </span>
                      )}
                      {event.title}
                    </button>
                  )
                })}
                {hiddenCount > 0 && (
                  <span className="px-1 text-[11px] text-fg-tertiary">+{hiddenCount} mehr</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
