import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGoal, deleteGoal, updateGoal } from '../api'
import type { DailyGoalInsert, DailyGoalUpdate } from '../types'

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (goal: DailyGoalInsert) => createGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_goals'] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, goal }: { id: string; goal: DailyGoalUpdate }) => updateGoal(id, goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_goals'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_goals'] })
    },
  })
}
