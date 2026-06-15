import type { EventColor } from './types'

export const EVENT_COLORS: { value: EventColor; label: string }[] = [
  { value: 'red', label: 'Rot' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Gelb' },
  { value: 'green', label: 'Grün' },
  { value: 'mint', label: 'Minze' },
  { value: 'teal', label: 'Türkis' },
  { value: 'blue', label: 'Blau' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'purple', label: 'Violett' },
  { value: 'pink', label: 'Pink' },
]

interface EventColorClasses {
  /** Dezenter Hintergrund für Event-Blöcke/Chips */
  bg: string
  /** Textfarbe für Titel/Chips */
  text: string
  /** Kräftige Akzentfarbe (Rahmen/Linie) */
  border: string
  /** Voll gefüllter Punkt (Farbauswahl, Indikatoren) */
  dot: string
}

export const eventColorClasses: Record<EventColor, EventColorClasses> = {
  red: { bg: 'bg-cal-red/15', text: 'text-cal-red', border: 'border-cal-red', dot: 'bg-cal-red' },
  orange: {
    bg: 'bg-cal-orange/15',
    text: 'text-cal-orange',
    border: 'border-cal-orange',
    dot: 'bg-cal-orange',
  },
  yellow: {
    bg: 'bg-cal-yellow/15',
    text: 'text-cal-yellow',
    border: 'border-cal-yellow',
    dot: 'bg-cal-yellow',
  },
  green: {
    bg: 'bg-cal-green/15',
    text: 'text-cal-green',
    border: 'border-cal-green',
    dot: 'bg-cal-green',
  },
  mint: { bg: 'bg-cal-mint/15', text: 'text-cal-mint', border: 'border-cal-mint', dot: 'bg-cal-mint' },
  teal: { bg: 'bg-cal-teal/15', text: 'text-cal-teal', border: 'border-cal-teal', dot: 'bg-cal-teal' },
  blue: { bg: 'bg-cal-blue/15', text: 'text-cal-blue', border: 'border-cal-blue', dot: 'bg-cal-blue' },
  indigo: {
    bg: 'bg-cal-indigo/15',
    text: 'text-cal-indigo',
    border: 'border-cal-indigo',
    dot: 'bg-cal-indigo',
  },
  purple: {
    bg: 'bg-cal-purple/15',
    text: 'text-cal-purple',
    border: 'border-cal-purple',
    dot: 'bg-cal-purple',
  },
  pink: { bg: 'bg-cal-pink/15', text: 'text-cal-pink', border: 'border-cal-pink', dot: 'bg-cal-pink' },
}
