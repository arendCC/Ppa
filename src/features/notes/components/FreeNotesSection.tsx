import { useState } from 'react'
import { clsx } from 'clsx'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useAutosaveNote } from '../hooks/useAutosaveNote'
import { useDeleteNote } from '../hooks/useNoteMutations'
import { getNoteLabel, getNoteSnippet } from '../utils'
import type { Note } from '../types'
import { NoteEditor } from './NoteEditor'

interface FreeNotesSectionProps {
  notes: Note[]
}

/** Freie Notizen: Liste mit Vorschau sowie Editor für die ausgewählte bzw. neue Notiz. */
export function FreeNotesSection({ notes }: FreeNotesSectionProps) {
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null)

  const freeNotes = notes.filter((note) => note.type === 'free')
  const selectedNote = selectedId && selectedId !== 'new' ? freeNotes.find((note) => note.id === selectedId) ?? null : null
  const isEditorOpen = selectedId !== null

  const deleteMutation = useDeleteNote()
  const { title, content, setTitle, setContent, status } = useAutosaveNote(
    selectedNote,
    { type: 'free', note_date: null, user_id: user?.id },
    (created) => setSelectedId(created.id),
  )

  function handleNew() {
    setSelectedId('new')
  }

  function handleSelect(note: Note) {
    setSelectedId(note.id)
  }

  function handleDelete() {
    if (selectedNote) deleteMutation.mutate(selectedNote.id)
    setSelectedId(null)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-fg">Notizen</h2>
        <Button variant="secondary" onClick={handleNew}>
          <Plus size={16} className="mr-1.5" />
          Neue Notiz
        </Button>
      </div>

      {isEditorOpen && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <NoteEditor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            status={status}
            onDelete={selectedNote ? handleDelete : undefined}
          />
        </div>
      )}

      {freeNotes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-fg-secondary">
          Noch keine Notizen.
        </p>
      ) : (
        <div className="space-y-2">
          {freeNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => handleSelect(note)}
              className={clsx(
                'block w-full rounded-xl border bg-surface p-3 text-left transition-colors hover:border-accent/50',
                selectedId === note.id ? 'border-accent' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-fg">{getNoteLabel(note)}</p>
                <span className="shrink-0 text-xs text-fg-tertiary">
                  {format(parseISO(note.updated_at), 'd. MMM yyyy, HH:mm', { locale: de })}
                </span>
              </div>
              {note.content && <p className="mt-1 line-clamp-2 text-sm text-fg-secondary">{getNoteSnippet(note.content)}</p>}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
