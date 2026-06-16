import { useState, type FormEvent } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/features/auth/AuthProvider'
import { useUpsertWeightEntry } from '../hooks/useWeightMutations'
import type { WeightEntry } from '../types'

interface WeightFormProps {
  existingEntries: WeightEntry[]
}

function todayStr() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function WeightForm({ existingEntries }: WeightFormProps) {
  const { user } = useAuth()
  const upsertMutation = useUpsertWeightEntry()

  const today = todayStr()
  const todayEntry = existingEntries.find((e) => e.date === today)

  const [date, setDate] = useState(today)
  const [weight, setWeight] = useState(todayEntry ? String(todayEntry.weight_kg) : '')
  const [note, setNote] = useState(todayEntry?.note ?? '')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const entryForDate = existingEntries.find((e) => e.date === date)
  const isUpdate = !!entryForDate

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const kg = parseFloat(weight.replace(',', '.'))
    if (isNaN(kg) || kg <= 0) {
      setError('Bitte ein gültiges Gewicht eingeben.')
      return
    }
    if (!user) {
      setError('Nicht angemeldet.')
      return
    }

    try {
      await upsertMutation.mutateAsync({ user_id: user.id, date, weight_kg: kg, note: note.trim() || null })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Datum</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              const existing = existingEntries.find((en) => en.date === e.target.value)
              if (existing) {
                setWeight(String(existing.weight_kg))
                setNote(existing.note ?? '')
              } else {
                setWeight('')
                setNote('')
              }
              setSuccess(false)
            }}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-fg-secondary">Gewicht (kg)</label>
          <Input
            type="number"
            step="0.1"
            min="20"
            max="500"
            placeholder="z. B. 75.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-fg-secondary">Notiz (optional)</label>
        <Textarea
          rows={2}
          placeholder="z. B. nach dem Sport, nüchtern..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-cal-red">{error}</p>}
      {success && <p className="text-sm text-cal-green">Gespeichert ✓</p>}

      <Button type="submit" disabled={upsertMutation.isPending} className="w-full sm:w-auto">
        {upsertMutation.isPending ? 'Speichern…' : isUpdate ? 'Eintrag aktualisieren' : 'Eintrag speichern'}
      </Button>
    </form>
  )
}
