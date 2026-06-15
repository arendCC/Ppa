import { useQuery } from '@tanstack/react-query'
import { fetchGoals } from '../api'

/** Lädt Tagesziele für einen Datumsbereich (Format 'yyyy-MM-dd', inklusive). */
export function useGoals(rangeStart: string, rangeEnd: string) {
  return useQuery({
    queryKey: ['daily_goals', rangeStart, rangeEnd],
    queryFn: () => fetchGoals(rangeStart, rangeEnd),
  })
}
