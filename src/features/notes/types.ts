import type { Database, NoteType } from '@/lib/supabase/types'

export type { NoteType }
export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']

/** Verzögerung bis zum automatischen Speichern nach der letzten Änderung. */
export const AUTOSAVE_DELAY_MS = 800

/** Anzahl vergangener Tages- bzw. Wochennotizen in der Historie. */
export const NOTES_HISTORY_LIMIT = 14
