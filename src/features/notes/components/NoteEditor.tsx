import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { AutosaveStatus } from '../hooks/useAutosaveNote'

interface NoteEditorProps {
  title: string
  content: string
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  status: AutosaveStatus
  showTitle?: boolean
  titlePlaceholder?: string
  contentPlaceholder?: string
  onDelete?: () => void
  rows?: number
}

const statusLabels: Record<AutosaveStatus, string> = {
  idle: '',
  saving: 'Speichert…',
  saved: 'Gespeichert',
}

/** Generischer Notiz-Editor mit optionalem Titel, Inhalt, Speicherstatus und Löschen-Button. */
export function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  status,
  showTitle = true,
  titlePlaceholder = 'Titel',
  contentPlaceholder = 'Notiz schreiben…',
  onDelete,
  rows = 6,
}: NoteEditorProps) {
  return (
    <div className="space-y-2">
      {showTitle && (
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={titlePlaceholder}
          aria-label="Titel"
          className="font-medium"
        />
      )}

      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={contentPlaceholder}
        aria-label="Inhalt"
        rows={rows}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-tertiary">{statusLabels[status]}</span>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Notiz löschen"
            title="Notiz löschen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface-secondary hover:text-cal-red"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
