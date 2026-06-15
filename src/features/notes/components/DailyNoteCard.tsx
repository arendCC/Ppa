import { useState } from 'react'
import { format } from 'date-fns'
import { useAuth } from '@/features/auth/AuthProvider'
import { useAutosaveNote } from '../hooks/useAutosaveNote'
import { useDeleteNote } from '../hooks/useNoteMutations'
import { getNoteLabel, getNoteSnippet } from '../utils'
import { NOTES_HISTORY_LIMIT } from '../types'
import type { Note } from '../types'
import { NoteDialog } from './NoteDialog'
import { NoteEditor } from './NoteEditor'
import { NoteHistoryList } from './NoteHistoryList'

interface DailyNoteCardProps {
  notes: Note[]
}

/** Tagesnotiz für heute mit Autosave sowie Historie vergangener Tagesnotizen. */
export function DailyNoteCard({ notes }: DailyNoteCardProps) {
  const { user } = useAuth()
  const [selected, setSelected] = useState<Note | null>(null)

  const today = format(new Date(), 'yyyy-MM-dd')
  const dailyNotes = notes.filter((note) => note.type === 'daily')
  const todayNote = dailyNotes.find((note) => note.note_date === today) ?? null
  const pastNotes = dailyNotes
    .filter((note) => note.note_date !== today)
    .sort((a, b) => (b.note_date ?? '').localeCompare(a.note_date ?? ''))
    .slice(0, NOTES_HISTORY_LIMIT)

  const deleteMutation = useDeleteNote()
  const { title, content, setTitle, setContent, status } = useAutosaveNote(todayNote, {
    type: 'daily',
    note_date: today,
    user_id: user?.id,
  })

  function handleDelete() {
    if (todayNote) deleteMutation.mutate(todayNote.id)
  }

  return (
    <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-fg">Tagesnotiz · Heute</h2>

      <NoteEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        status={status}
        showTitle={false}
        contentPlaceholder="Was ist heute passiert?"
        onDelete={todayNote ? handleDelete : undefined}
      />

      <NoteHistoryList
        title="Vergangene Tagesnotizen"
        notes={pastNotes}
        getLabel={getNoteLabel}
        getSnippet={(note) => getNoteSnippet(note.content)}
        onSelect={setSelected}
        emptyText="Noch keine vergangenen Tagesnotizen."
      />

      <NoteDialog open={selected !== null} onClose={() => setSelected(null)} note={selected} />
    </section>
  )
}
