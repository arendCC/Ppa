import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRecurringTask, deleteRecurringTask, updateRecurringTask } from '../api'
import type { RecurringTaskInsert, RecurringTaskUpdate } from '../types'

export function useCreateRecurringTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (task: RecurringTaskInsert) => createRecurringTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_tasks'] })
    },
  })
}

export function useUpdateRecurringTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: RecurringTaskUpdate }) => updateRecurringTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_tasks'] })
    },
  })
}

export function useDeleteRecurringTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRecurringTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring_tasks'] })
    },
  })
}
