import type { Note } from '../types'

interface NoteHistoryListProps {
  title: string
  notes: Note[]
  getLabel: (note: Note) => string
  getSnippet: (note: Note) => string
  onSelect: (note: Note) => void
  emptyText: string
}

/** Liste vergangener Notizen mit Vorschau, klickbar zum Öffnen. */
export function NoteHistoryList({ title, notes, getLabel, getSnippet, onSelect, emptyText }: NoteHistoryListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-fg-secondary">{title}</h3>

      {notes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-fg-secondary">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => {
            const snippet = getSnippet(note)
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => onSelect(note)}
                className="block w-full rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-accent/50"
              >
                <p className="text-sm font-medium text-fg">{getLabel(note)}</p>
                {snippet && <p className="mt-1 line-clamp-2 text-sm text-fg-secondary">{snippet}</p>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
