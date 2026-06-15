import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote, deleteNote, updateNote } from '../api'
import type { NoteInsert, NoteUpdate } from '../types'

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (note: NoteInsert) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: NoteUpdate }) => updateNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
