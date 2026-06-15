import type { RecurrenceType } from './types'

export const RECURRENCE_TYPES: { value: RecurrenceType; label: string }[] = [
  { value: 'daily', label: 'Täglich' },
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'monthly', label: 'Monatlich' },
  { value: 'custom', label: 'Benutzerdefiniert' },
]

export const recurrenceTypeLabels: Record<RecurrenceType, string> = {
  daily: 'Täglich',
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
  custom: 'Benutzerdefiniert',
}

/** Beschreibt das Wiederholungsintervall einer Vorlage in lesbarer Form, z. B. "Alle 3 Tage". */
export function describeRecurrence(type: RecurrenceType, interval: number): string {
  if (type === 'custom') {
    return interval === 1 ? 'Jeden Tag' : `Alle ${interval} Tage`
  }
  return recurrenceTypeLabels[type]
}
