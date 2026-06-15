import { useState } from 'react'
import { DailyNoteCard } from './components/DailyNoteCard'
import { FreeNotesSection } from './components/FreeNotesSection'
import { NoteDialog } from './components/NoteDialog'
import { NoteSearch } from './components/NoteSearch'
import { WeeklyNoteCard } from './components/WeeklyNoteCard'
import { useNotes } from './hooks/useNotes'
import type { Note } from './types'

/** Notizen: Suche, Tages- und Wochennotiz mit Autosave sowie freie Notizen. */
export function NotesPage() {
  const { data: notes = [], isError } = useNotes()
  const [searchResult, setSearchResult] = useState<Note | null>(null)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-fg">Notizen</h1>

      {isError && (
        <div className="rounded-lg border border-cal-red/30 bg-cal-red/10 px-3 py-2 text-sm text-cal-red">
          Notizen konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
        </div>
      )}

      <NoteSearch notes={notes} onSelect={setSearchResult} />

      <DailyNoteCard notes={notes} />
      <WeeklyNoteCard notes={notes} />

      <div className="border-t border-border pt-4">
        <FreeNotesSection notes={notes} />
      </div>

      <NoteDialog open={searchResult !== null} onClose={() => setSearchResult(null)} note={searchResult} />
    </div>
  )
}
