import type { WeightEntry } from '../types'

interface WeightStatsProps {
  entries: WeightEntry[]
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-4 shadow-soft">
      <p className="text-xs font-medium text-fg-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-fg">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-fg-tertiary">{sub}</p>}
    </div>
  )
}

export function WeightStats({ entries }: WeightStatsProps) {
  if (entries.length === 0) return null

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted[sorted.length - 1]
  const first = sorted[0]
  const weights = sorted.map((e) => e.weight_kg)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const diff = +(latest.weight_kg - first.weight_kg).toFixed(1)
  const diffLabel = diff > 0 ? `+${diff} kg` : `${diff} kg`
  const diffSub = diff > 0 ? 'seit Start zugenommen' : diff < 0 ? 'seit Start abgenommen' : 'unverändert'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Aktuell" value={`${latest.weight_kg.toFixed(1)} kg`} sub={latest.date} />
      <StatCard label="Veränderung" value={diffLabel} sub={diffSub} />
      <StatCard label="Minimum" value={`${min.toFixed(1)} kg`} />
      <StatCard label="Maximum" value={`${max.toFixed(1)} kg`} />
    </div>
  )
}
