import { supabase } from '@/lib/supabase/client'
import type { Note, NoteInsert, NoteUpdate } from './types'

/** Lädt alle Notizen des angemeldeten Nutzers, neueste Änderung zuerst. */
export async function fetchNotes(): Promise<Note[]> {
  const { data, error } = await supabase.from('notes').select('*').order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createNote(note: NoteInsert): Promise<Note> {
  const { data, error } = await supabase.from('notes').insert(note).select().single()
  if (error) throw error
  return data
}

export async function updateNote(id: string, note: NoteUpdate): Promise<Note> {
  const { data, error } = await supabase.from('notes').update(note).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}
