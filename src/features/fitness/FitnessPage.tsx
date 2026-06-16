import { Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useWeightEntries } from './hooks/useWeightEntries'
import { useDeleteWeightEntry } from './hooks/useWeightMutations'
import { WeightForm } from './components/WeightForm'
import { WeightChart } from './components/WeightChart'
import { WeightStats } from './components/WeightStats'

export function FitnessPage() {
  const { data: entries = [], isError } = useWeightEntries()
  const deleteMutation = useDeleteWeightEntry()

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">Fitness</h1>

      {isError && (
        <div className="rounded-xl border border-cal-red/30 bg-cal-red/10 px-4 py-2.5 text-sm text-cal-red">
          Daten konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
        </div>
      )}

      <WeightStats entries={entries} />

      <Card>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-fg">Gewicht eintragen</h2>
        <WeightForm existingEntries={entries} />
      </Card>

      {entries.length > 1 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-fg">Verlauf</h2>
          <WeightChart entries={entries} />
        </Card>
      )}

      {entries.length > 0 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-fg">Alle Einträge</h2>
          <div className="divide-y divide-border/60">
            {sorted.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2.5">
                <div>
                  <span className="font-medium text-fg">{entry.weight_kg.toFixed(1)} kg</span>
                  <span className="ml-3 text-sm text-fg-secondary">{entry.date}</span>
                  {entry.note && (
                    <p className="mt-0.5 text-xs text-fg-tertiary">{entry.note}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(entry.id)}
                  disabled={deleteMutation.isPending}
                  className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-cal-red/10 hover:text-cal-red"
                  aria-label="Eintrag löschen"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
