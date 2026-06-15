import { clsx } from 'clsx'
import { endOfDay, format, parseISO, startOfDay } from 'date-fns'
import { Link } from 'react-router-dom'
import { eventColorClasses } from '@/features/calendar/colors'
import { useEvents } from '@/features/calendar/hooks/useEvents'

/** Dashboard-Karte: heutige Termine aus dem Kalender. */
export function TodayEventsCard() {
  const now = new Date()
  const { data: events = [] } = useEvents(startOfDay(now), endOfDay(now))

  const sorted = [...events].sort((a, b) => a.start_time.localeCompare(b.start_time))

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-fg">Heutige Termine</h2>
        <Link to="/calendar" className="text-sm font-medium text-accent hover:underline">
          Kalender öffnen
        </Link>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-fg-tertiary">Heute keine Termine.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((event) => {
            const colors = eventColorClasses[event.color]
            return (
              <li key={event.id} className="flex items-center gap-3 text-sm">
                <span className={clsx('h-2 w-2 shrink-0 rounded-full', colors.dot)} />
                <span className="w-14 shrink-0 font-medium text-fg-secondary">
                  {event.all_day ? 'Ganztags' : format(parseISO(event.start_time), 'HH:mm')}
                </span>
                <span className="truncate text-fg">{event.title}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
