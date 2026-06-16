import { useState } from 'react'
import { subDays, parseISO } from 'date-fns'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  type TooltipProps,
} from 'recharts'
import type { WeightEntry } from '../types'

type Range = '30' | '90' | 'all'

interface WeightChartProps {
  entries: WeightEntry[]
}

const RANGES: { value: Range; label: string }[] = [
  { value: '30', label: '30 Tage' },
  { value: '90', label: '90 Tage' },
  { value: 'all', label: 'Alles' },
]

function filterByRange(entries: WeightEntry[], range: Range): WeightEntry[] {
  if (range === 'all') return entries
  const cutoff = subDays(new Date(), parseInt(range))
  return entries.filter((e) => parseISO(e.date) >= cutoff)
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload as WeightEntry
  return (
    <div className="rounded-xl border border-border/60 bg-surface px-3 py-2 shadow-soft-lg text-sm">
      <p className="font-medium text-fg">{entry.weight_kg.toFixed(1)} kg</p>
      <p className="text-fg-secondary">{entry.date}</p>
      {entry.note && <p className="mt-1 text-xs text-fg-tertiary">{entry.note}</p>}
    </div>
  )
}

export function WeightChart({ entries }: WeightChartProps) {
  const [range, setRange] = useState<Range>('30')

  const filtered = filterByRange(entries, range)

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <RangeSelector range={range} onChange={setRange} />
        <p className="py-10 text-center text-sm text-fg-tertiary">
          Keine Einträge im gewählten Zeitraum.
        </p>
      </div>
    )
  }

  const weights = filtered.map((e) => e.weight_kg)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const avg = weights.reduce((s, w) => s + w, 0) / weights.length

  const domainPad = Math.max((maxW - minW) * 0.3, 1)
  const yMin = Math.floor(minW - domainPad)
  const yMax = Math.ceil(maxW + domainPad)

  return (
    <div className="flex flex-col gap-4">
      <RangeSelector range={range} onChange={setRange} />
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={filtered} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--fg-secondary)' }}
            tickFormatter={(v: string) => {
              const [, m, d] = v.split('-')
              return `${d}.${m}`
            }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: 'var(--fg-secondary)' }}
            tickFormatter={(v: number) => `${v}`}
            tickLine={false}
            axisLine={false}
            width={36}
            unit=" kg"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avg}
            stroke="var(--color-accent)"
            strokeDasharray="4 3"
            strokeOpacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="weight_kg"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'var(--color-accent)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'var(--color-accent)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function RangeSelector({ range, onChange }: { range: Range; onChange: (r: Range) => void }) {
  return (
    <div className="flex gap-1">
      {RANGES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={[
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            range === value
              ? 'bg-accent-gradient text-white shadow-soft'
              : 'text-fg-secondary hover:text-fg',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
