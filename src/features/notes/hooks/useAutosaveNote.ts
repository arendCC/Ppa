import { useCallback, useEffect, useRef, useState } from 'react'
import { AUTOSAVE_DELAY_MS } from '../types'
import type { Note, NoteInsert } from '../types'
import { useCreateNote, useUpdateNote } from './useNoteMutations'

export type AutosaveStatus = 'idle' | 'saving' | 'saved'

/**
 * Debounced Autosave für Notizen: legt die Notiz bei der ersten Änderung an
 * und speichert danach automatisch bei jeder weiteren Änderung.
 */
export function useAutosaveNote(
  note: Note | null,
  createDefaults: Omit<NoteInsert, 'title' | 'content'>,
  onCreated?: (note: Note) => void,
) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const [noteId, setNoteId] = useState<string | null>(note?.id ?? null)

  const [loadedNoteId, setLoadedNoteId] = useState(note?.id ?? null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const baselineRef = useRef({ title: note?.title ?? '', content: note?.content ?? '' })

  const createMutation = useCreateNote()
  const updateMutation = useUpdateNote()

  if (loadedNoteId !== (note?.id ?? null)) {
    setLoadedNoteId(note?.id ?? null)
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
    setStatus('idle')
    setNoteId(note?.id ?? null)
  }

  useEffect(() => {
    baselineRef.current = { title: note?.title ?? '', content: note?.content ?? '' }
  }, [note?.id, note?.title, note?.content])

  const save = useCallback(async () => {
    try {
      if (noteId) {
        await updateMutation.mutateAsync({ id: noteId, note: { title: title || null, content } })
      } else {
        if (!title.trim() && !content.trim()) {
          setStatus('idle')
          return
        }

        const created = await createMutation.mutateAsync({ ...createDefaults, title: title || null, content })
        setNoteId(created.id)
        onCreated?.(created)
      }

      setStatus('saved')
    } catch (error) {
      console.error('Notiz konnte nicht gespeichert werden:', error)
      setStatus('idle')
    }
  }, [noteId, title, content, createMutation, updateMutation, createDefaults, onCreated])

  useEffect(() => {
    if (title === baselineRef.current.title && content === baselineRef.current.content) {
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setStatus('saving')
    timeoutRef.current = setTimeout(() => {
      void save()
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content])

  return { title, setTitle, content, setContent, status, noteId }
}
