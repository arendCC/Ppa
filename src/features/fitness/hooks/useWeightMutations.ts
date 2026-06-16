import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWeightEntry, upsertWeightEntry } from '../api'
import type { WeightEntryInsert } from '../types'

export function useUpsertWeightEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entry: WeightEntryInsert) => upsertWeightEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight_entries'] })
    },
  })
}

export function useDeleteWeightEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWeightEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight_entries'] })
    },
  })
}
