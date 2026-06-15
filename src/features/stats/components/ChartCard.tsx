import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/** Karte mit Titel/Beschreibung und festem Diagramm-Bereich für Recharts (ResponsiveContainer). */
export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <div>
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        {description && <p className="text-sm text-fg-secondary">{description}</p>}
      </div>

      <div className={clsx('h-64 w-full', className)}>{children}</div>
    </div>
  )
}
