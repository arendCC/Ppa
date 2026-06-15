import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvent, deleteEvent, updateEvent } from '../api'
import type { CalendarEventInsert, CalendarEventUpdate } from '../types'

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (event: CalendarEventInsert) => createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: CalendarEventUpdate }) => updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
