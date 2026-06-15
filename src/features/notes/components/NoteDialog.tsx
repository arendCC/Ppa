import { Modal } from '@/components/ui/Modal'
import { useAutosaveNote } from '../hooks/useAutosaveNote'
import { useDeleteNote } from '../hooks/useNoteMutations'
import { getNoteLabel } from '../utils'
import type { Note } from '../types'
import { NoteEditor } from './NoteEditor'

interface NoteDialogProps {
  open: boolean
  onClose: () => void
  note: Note | null
}

/** Modal zum Ansehen und Bearbeiten einer einzelnen Notiz (Historie, Suche). */
export function NoteDialog({ open, onClose, note }: NoteDialogProps) {
  const deleteMutation = useDeleteNote()

  const createDefaults = {
    type: note?.type ?? 'free',
    note_date: note?.note_date ?? null,
    user_id: note?.user_id,
  } as const

  const { title, content, setTitle, setContent, status } = useAutosaveNote(note, createDefaults)

  if (!open || !note) return null

  const currentNote = note

  function handleDelete() {
    deleteMutation.mutate(currentNote.id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={getNoteLabel(note)}>
      <NoteEditor
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        status={status}
        showTitle={note.type === 'free'}
        onDelete={handleDelete}
        rows={10}
      />
    </Modal>
  )
}
