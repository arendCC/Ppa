import { useQuery } from '@tanstack/react-query'
import { fetchWeeklyGoals } from '../api'

/** Lädt Wochenziele für einen Wochenstart-Bereich (Format 'yyyy-MM-dd', inklusive). */
export function useWeeklyGoals(rangeStart: string, rangeEnd: string) {
  return useQuery({
    queryKey: ['weekly_goals', rangeStart, rangeEnd],
    queryFn: () => fetchWeeklyGoals(rangeStart, rangeEnd),
  })
}
