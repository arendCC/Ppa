import { useQuery } from '@tanstack/react-query'
import { getWeightEntries } from '../api'

export function useWeightEntries() {
  return useQuery({
    queryKey: ['weight_entries'],
    queryFn: getWeightEntries,
  })
}
