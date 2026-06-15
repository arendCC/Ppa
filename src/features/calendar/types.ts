import type { Database, EventColor } from '@/lib/supabase/types'

export type { EventColor }

export type CalendarEvent = Database['public']['Tables']['events']['Row']
export type CalendarEventInsert = Database['public']['Tables']['events']['Insert']
export type CalendarEventUpdate = Database['public']['Tables']['events']['Update']

export type CalendarView = 'day' | 'week' | 'month'

export const DEFAULT_EVENT_COLOR: EventColor = 'blue'

/** Werte des Termin-Formulars (Erstellen/Bearbeiten). */
export interface EventFormValues {
  title: string
  description: string
  location: string
  allDay: boolean
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  color: EventColor
}
