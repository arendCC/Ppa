import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { de } from 'date-fns/locale'
import type { CalendarView } from '../types'

const weekOptions = { weekStartsOn: 1 as const, locale: de }

/** Sichtbarer Datumsbereich für die jeweilige Ansicht (Monat inkl. Rand-Wochen). */
export function getViewRange(date: Date, view: CalendarView): { start: Date; end: Date } {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) }
    case 'week':
      return { start: startOfWeek(date, weekOptions), end: endOfWeek(date, weekOptions) }
    case 'month': {
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      return {
        start: startOfWeek(monthStart, weekOptions),
        end: endOfWeek(monthEnd, weekOptions),
      }
    }
  }
}

/** Alle Tage der sichtbaren Ansicht als Date-Array. */
export function getViewDays(date: Date, view: CalendarView): Date[] {
  const { start, end } = getViewRange(date, view)
  return eachDayOfInterval({ start, end })
}

/** Springt einen Schritt (Tag/Woche/Monat) vor oder zurück. */
export function navigateDate(date: Date, view: CalendarView, direction: 1 | -1): Date {
  switch (view) {
    case 'day':
      return addDays(date, direction)
    case 'week':
      return addWeeks(date, direction)
    case 'month':
      return addMonths(date, direction)
  }
}

/** Lesbarer Titel für den Kalender-Header. */
export function getViewTitle(date: Date, view: CalendarView): string {
  switch (view) {
    case 'day':
      return format(date, 'EEEE, d. MMMM yyyy', { locale: de })
    case 'week': {
      const { start, end } = getViewRange(date, view)
      if (start.getFullYear() !== end.getFullYear()) {
        return `${format(start, 'd. MMM yyyy', { locale: de })} – ${format(end, 'd. MMM yyyy', { locale: de })}`
      }
      if (start.getMonth() !== end.getMonth()) {
        return `${format(start, 'd. MMM', { locale: de })} – ${format(end, 'd. MMM yyyy', { locale: de })}`
      }
      return `${format(start, 'd.')} – ${format(end, 'd. MMMM yyyy', { locale: de })}`
    }
    case 'month':
      return format(date, 'MMMM yyyy', { locale: de })
  }
}
