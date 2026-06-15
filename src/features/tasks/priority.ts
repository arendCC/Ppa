import type { TaskPriority } from './types'

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Niedrig' },
  { value: 'medium', label: 'Mittel' },
  { value: 'high', label: 'Hoch' },
]

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
}

interface TaskPriorityClasses {
  /** Dezenter Hintergrund für Prioritäts-Badges */
  bg: string
  /** Textfarbe für Prioritäts-Badges */
  text: string
  /** Voll gefüllter Punkt im Badge */
  dot: string
}

export const taskPriorityClasses: Record<TaskPriority, TaskPriorityClasses> = {
  low: { bg: 'bg-cal-blue/15', text: 'text-cal-blue', dot: 'bg-cal-blue' },
  medium: { bg: 'bg-cal-orange/15', text: 'text-cal-orange', dot: 'bg-cal-orange' },
  high: { bg: 'bg-cal-red/15', text: 'text-cal-red', dot: 'bg-cal-red' },
}

/** Rangfolge für die Sortierung nach Priorität (hoch zuerst). */
export const TASK_PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
}
