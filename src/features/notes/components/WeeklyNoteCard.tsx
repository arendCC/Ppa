import { useState } from 'react'
import { useAuth } from '@/features/auth/AuthProvider'
import { getWeekStart } from '@/features/weekly-goals/utils'
import { useAutosaveNote } from '../hooks/useAutosaveNote'
import { useDeleteNote } from '../hooks/useNoteMutations'
import { getNoteLabel, getNoteSnippet } from '../utils'
import { NOTES_HISTORY_LIMIT } from '../types'
import type { Note } from '../types'
import { NoteDialog } from './NoteDialog'
import { NoteEditor } from './NoteEditor'
import { NoteHistoryList } from './NoteHistoryList'

interface WeeklyNoteCardProps {
  notes: Note[]
}

/** Wochennotiz für die aktuelle Woche mit Autosave sowie Historie vergangener Wochen. */
export function WeeklyNoteCard({ notes }: WeeklyNoteCardProps) {
  const { user } = useAuth()
  const [selected, setSelected] = useState<Note | null>(null)

  const weekStart = getWeekStart(new Date())
  const weeklyNotes = notes.filter((note) => note.type === 'weekly')
  const weekNote = weeklyNotes.find((note) => note.note_date === weekStart) ?? null
  const pastNotes = weeklyNotes
    .filter((note) => note.note_date !== weekStart)
    .sort((a, b) => (b.note_date ?? '').localeCompare(a.note_date ?? ''))
    .slice(0, NOTES_HISTORY_LIMIT)

  const deleteMutation = useDeleteNote()
  const { title, content, setTitle, setContent, status } = useAutosaveNote(weekNote, {
    type: 'weekly',
    note_date: weekStart,
    user_id: user?.id,
  })

  function handleDelete() {
    if (weekNote) deleteMutation.mutate(weekNote.id)
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-fg">Wochennotiz · Diese Woche</h2>

      <NoteEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        status={status}
        showTitle={false}
        contentPlaceholder="Notizen, Rückblick oder Plan für diese Woche…"
        onDelete={weekNote ? handleDelete : undefined}
      />

      <NoteHistoryList
        title="Vergangene Wochennotizen"
        notes={pastNotes}
        getLabel={getNoteLabel}
        getSnippet={(note) => getNoteSnippet(note.content)}
        onSelect={setSelected}
        emptyText="Noch keine vergangenen Wochennotizen."
      />

      <NoteDialog open={selected !== null} onClose={() => setSelected(null)} note={selected} />
    </section>
  )
}
