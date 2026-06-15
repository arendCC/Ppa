import { useMutation, useQueryClient } from '@tanstack/react-query'
import { archiveCompletedWeeklyGoals, createWeeklyGoal, deleteWeeklyGoal, updateWeeklyGoal } from '../api'
import type { WeeklyGoalInsert, WeeklyGoalUpdate } from '../types'

export function useCreateWeeklyGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (goal: WeeklyGoalInsert) => createWeeklyGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_goals'] })
    },
  })
}

export function useUpdateWeeklyGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, goal }: { id: string; goal: WeeklyGoalUpdate }) => updateWeeklyGoal(id, goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_goals'] })
    },
  })
}

export function useDeleteWeeklyGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWeeklyGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_goals'] })
    },
  })
}

export function useArchiveCompletedWeeklyGoals() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (weekStart: string) => archiveCompletedWeeklyGoals(weekStart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly_goals'] })
    },
  })
}
