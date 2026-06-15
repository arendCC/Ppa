import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { getNoteLabel, getNoteSnippet, noteTypeLabels, searchNotes } from '../utils'
import type { Note } from '../types'

interface NoteSearchProps {
  notes: Note[]
  onSelect: (note: Note) => void
}

/** Suche über alle Notizen (Titel und Inhalt). */
export function NoteSearch({ notes, onSelect }: NoteSearchProps) {
  const [query, setQuery] = useState('')
  const results = searchNotes(notes, query)

  return (
    <section className="space-y-2">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Notizen durchsuchen…"
          aria-label="Notizen durchsuchen"
          className="pl-9"
        />
      </div>

      {query.trim() && (
        <div className="space-y-2">
          {results.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-fg-secondary">
              Keine Notizen gefunden.
            </p>
          ) : (
            results.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => onSelect(note)}
                className="block w-full rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-accent/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-fg">{getNoteLabel(note)}</p>
                  <span className="shrink-0 rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium text-fg-secondary">
                    {noteTypeLabels[note.type]}
                  </span>
                </div>
                {note.content && (
                  <p className="mt-1 line-clamp-2 text-sm text-fg-secondary">{getNoteSnippet(note.content)}</p>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </section>
  )
}
