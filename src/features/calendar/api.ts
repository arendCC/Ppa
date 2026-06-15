import { supabase } from '@/lib/supabase/client'
import type { CalendarEvent, CalendarEventInsert, CalendarEventUpdate } from './types'

/** Lädt alle Termine, die sich mit [rangeStart, rangeEnd] überschneiden. */
export async function fetchEvents(rangeStart: Date, rangeEnd: Date): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .lte('start_time', rangeEnd.toISOString())
    .gte('end_time', rangeStart.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createEvent(event: CalendarEventInsert): Promise<CalendarEvent> {
  const { data, error } = await supabase.from('events').insert(event).select().single()
  if (error) throw error
  return data
}

export async function updateEvent(id: string, event: CalendarEventUpdate): Promise<CalendarEvent> {
  const { data, error } = await supabase.from('events').update(event).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}
