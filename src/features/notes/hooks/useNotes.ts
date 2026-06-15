import { useQuery } from '@tanstack/react-query'
import { fetchNotes } from '../api'

/** Lädt alle Notizen des angemeldeten Nutzers. */
export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  })
}
