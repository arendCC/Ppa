import { useQuery } from '@tanstack/react-query'
import { fetchEvents } from '../api'

export function useEvents(rangeStart: Date, rangeEnd: Date) {
  return useQuery({
    queryKey: ['events', rangeStart.toISOString(), rangeEnd.toISOString()],
    queryFn: () => fetchEvents(rangeStart, rangeEnd),
  })
}
