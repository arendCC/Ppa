import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRecurringTasks } from '../hooks/useRecurringTasks'
import { useUpdateRecurringTask } from '../hooks/useRecurringTaskMutations'
import type { RecurringTask } from '../types'
import { RecurringTaskDialog } from './RecurringTaskDialog'
import { RecurringTaskItem } from './RecurringTaskItem'

interface RecurringTasksSectionProps {
  /** Bereits verwendete Kategorien als Vorschläge. */
  categories: string[]
}

/** Verwaltung der Vorlagen für wiederkehrende Aufgaben (täglich/wöchentlich/monatlich/benutzerdefiniert). */
export function RecurringTasksSection({ categories }: RecurringTasksSectionProps) {
  const { data: recurringTasks = [], isError } = useRecurringTasks()
  const updateMutation = useUpdateRecurringTask()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<RecurringTask | null>(null)

  function handleNew() {
    setSelected(null)
    setDialogOpen(true)
  }

  function handleClick(recurringTask: RecurringTask) {
    setSelected(recurringTask)
    setDialogOpen(true)
  }

  function handleToggleActive(recurringTask: RecurringTask) {
    updateMutation.mutate({ id: recurringTask.id, task: { active: !recurringTask.active } })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-fg">Wiederkehrende Aufgaben</h2>
        <Button variant="secondary" onClick={handleNew}>
          <Plus size={16} className="mr-1.5" />
          Neue Vorlage
        </Button>
      </div>

      {isError && (
        <div className="rounded-lg border border-cal-red/30 bg-cal-red/10 px-3 py-2 text-sm text-cal-red">
          Wiederkehrende Aufgaben konnten nicht geladen werden. Bitte überprüfe deine Supabase-Konfiguration.
        </div>
      )}

      {recurringTasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-fg-secondary">
          Noch keine wiederkehrenden Aufgaben.
        </p>
      ) : (
        <div className="space-y-2">
          {recurringTasks.map((recurringTask) => (
            <RecurringTaskItem
              key={recurringTask.id}
              recurringTask={recurringTask}
              onToggleActive={handleToggleActive}
              onClick={handleClick}
            />
          ))}
        </div>
      )}

      <RecurringTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        recurringTask={selected}
        categories={categories}
      />
    </section>
  )
}
