import type { TooltipContentProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

/** Einheitlich gestyltes Tooltip für alle Statistik-Diagramme. */
export function ChartTooltip({ active, payload, label }: Partial<TooltipContentProps<ValueType, NameType>>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-lg">
      {label !== undefined && <p className="font-medium text-fg">{label}</p>}
      {payload.map((entry) => (
        <p key={`${entry.dataKey}`} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.unit ?? ''}
        </p>
      ))}
    </div>
  )
}
