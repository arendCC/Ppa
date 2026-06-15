import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { formatWeekRange } from '@/features/weekly-goals/utils'
import type { Note, NoteType } from './types'

export const noteTypeLabels: Record<NoteType, string> = {
  free: 'Notiz',
  daily: 'Tagesnotiz',
  weekly: 'Wochennotiz',
}

/** Liefert einen lesbaren Titel für eine Notiz je nach Typ. */
export function getNoteLabel(note: Note): string {
  if (note.type === 'daily' && note.note_date) {
    return format(parseISO(note.note_date), 'EEEE, d. MMMM yyyy', { locale: de })
  }

  if (note.type === 'weekly' && note.note_date) {
    return formatWeekRange(note.note_date)
  }

  return note.title?.trim() || 'Ohne Titel'
}

/** Kürzt den Inhalt einer Notiz für die Vorschau. */
export function getNoteSnippet(content: string, maxLength = 120): string {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trimEnd()}…`
}

/** Durchsucht Notizen anhand von Titel und Inhalt (case-insensitive). */
export function searchNotes(notes: Note[], query: string): Note[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []

  return notes.filter((note) => {
    const title = note.title?.toLowerCase() ?? ''
    const content = note.content.toLowerCase()
    return title.includes(trimmed) || content.includes(trimmed)
  })
}
