import { CalendarGridView } from './CalendarGridView'
import type { TimeSlotRange } from './TimeGrid'
import type { CalendarEvent } from '../types'

interface DayViewProps {
  date: Date
  events: CalendarEvent[]
  onSlotClick: (range: TimeSlotRange) => void
  onEventClick: (event: CalendarEvent) => void
}

export function DayView({ date, events, onSlotClick, onEventClick }: DayViewProps) {
  return <CalendarGridView days={[date]} events={events} onSlotClick={onSlotClick} onEventClick={onEventClick} />
}
