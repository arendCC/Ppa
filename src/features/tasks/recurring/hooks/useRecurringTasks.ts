import { useQuery } from '@tanstack/react-query'
import { fetchRecurringTasks } from '../api'

export function useRecurringTasks() {
  return useQuery({
    queryKey: ['recurring_tasks'],
    queryFn: fetchRecurringTasks,
  })
}
