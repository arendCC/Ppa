import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { CalendarHeader } from './components/CalendarHeader'
import { DayView } from './components/DayView'
import { WeekView } from './components/WeekView'
import { MonthView } from './components/MonthView'
import { EventDialog, type InitialEventRange } from './components/EventDialog'
import type { TimeSlotRange } from './components/TimeGrid'
import { useEvents } from './hooks/useEvents'
import { getViewDays, getViewRange, getViewTitle, navigateDate } from './utils/dateRange'
import type { CalendarEvent, CalendarView } from './types'

function parseDateParam(value: string | null): Date {
  if (!value) return new Date()
  const parsed = parseISO(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

function getDefaultView(): CalendarView {
  return window.innerWidth < 768 ? 'day' : 'week'
}

function getDefaultRange(base: Date): InitialEventRange {
  const start = new Date(base)
  start.setHours(9, 0, 0, 0)
  const end = new Date(start)
  end.setHours(10, 0, 0, 0)
  return { start, end }
}

/** Kalenderseite: verbindet Header, Ansichten und Termin-Dialog, Zustand über URL-Parameter. */
export function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const view = (searchParams.get('view') as CalendarView | null) ?? getDefaultView()
  const date = parseDateParam(searchParams.get('date'))

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [initialRange, setInitialRange] = useState<InitialEventRange | null>(null)

  const { start, end } = useMemo(() => getViewRange(date, view), [date, view])
  const days = useMemo(() => getViewDays(date, view), [date, view])
  const title = useMemo(() => getViewTitle(date, view), [date, view])

  const { data: events = [], isError } = useEvents(start, end)

  function updateParams(next: { view?: CalendarView; date?: Date }) {
    const params = new URLSearchParams(searchParams)
    if (next.view) params.set('view', next.view)
    if (next.date) params.set('date', format(next.date, 'yyyy-MM-dd'))
    setSearchParams(params, { replace: true })
  }

  function handleViewChange(nextView: CalendarView) {
    updateParams({ view: nextView })
  }

  function handlePrev() {
    updateParams({ date: navigateDate(date, view, -1) })
  }

  function handleNext() {
    updateParams({ date: navigateDate(date, view, 1) })
  }

  function handleToday() {
    updateParams({ date: new Date() })
  }

  function handleDayClick(clickedDate: Date) {
    updateParams({ view: 'day', date: clickedDate })
  }

  function handleNewEvent() {
    setSelectedEvent(null)
    setInitialRange(getDefaultRange(date))
    setDialogOpen(true)
  }

  function handleSlotClick(range: TimeSlotRange) {
    setSelectedEvent(null)
    setInitialRange({ start: range.start, end: range.end })
    setDialogOpen(true)
  }

  function handleEventClick(event: CalendarEvent) {
    setSelectedEvent(event)
    setInitialRange(null)
    setDialogOpen(true)
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col gap-4 md:h-[calc(100vh-6.5rem)]">
      <CalendarHeader
        title={title}
        view={view}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onNewEvent={handleNewEvent}
      />

      {isError && (
        <div className="rounded-lg border border-cal-red/30 bg-cal-red/10 px-3 py-2 text-sm text-cal-red">
          Termine konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {view === 'day' && (
          <DayView date={date} events={events} onSlotClick={handleSlotClick} onEventClick={handleEventClick} />
        )}
        {view === 'week' && (
          <WeekView days={days} events={events} onSlotClick={handleSlotClick} onEventClick={handleEventClick} />
        )}
        {view === 'month' && (
          <MonthView days={days} month={date} events={events} onDayClick={handleDayClick} onEventClick={handleEventClick} />
        )}
      </div>

      <EventDialog open={dialogOpen} onClose={() => setDialogOpen(false)} event={selectedEvent} initialRange={initialRange} />
    </div>
  )
}
