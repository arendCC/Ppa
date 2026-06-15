import { CalendarGridView } from './CalendarGridView'
import type { TimeSlotRange } from './TimeGrid'
import type { CalendarEvent } from '../types'

interface WeekViewProps {
  days: Date[]
  events: CalendarEvent[]
  onSlotClick: (range: TimeSlotRange) => void
  onEventClick: (event: CalendarEvent) => void
}

export function WeekView({ days, events, onSlotClick, onEventClick }: WeekViewProps) {
  return <CalendarGridView days={days} events={events} onSlotClick={onSlotClick} onEventClick={onEventClick} />
}
