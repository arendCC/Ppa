import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/AuthProvider'
import { generateDueRecurringTasks } from '../api'

/** Nutzer, für die in dieser Sitzung bereits fällige Aufgaben erzeugt wurden. */
const generatedForUsers = new Set<string>()

/** Erzeugt einmal pro Sitzung fällige Aufgaben aus aktiven wiederkehrenden Vorlagen. */
export function useGenerateDueRecurringTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user || generatedForUsers.has(user.id)) return
    generatedForUsers.add(user.id)

    generateDueRecurringTasks()
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.invalidateQueries({ queryKey: ['recurring_tasks'] })
      })
      .catch((error: unknown) => {
        generatedForUsers.delete(user.id)
        console.error('Wiederkehrende Aufgaben konnten nicht erzeugt werden:', error)
      })
  }, [user, queryClient])
}
