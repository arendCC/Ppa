/** Ergebnis der Intervall-Packung: Spalten-/Zeilenindex plus Gesamtanzahl in dieser Gruppe. */
export interface PackedInterval<T> {
  item: T
  index: number
  count: number
}

/**
 * Packt überlappende Intervalle in nebeneinanderliegende Slots (Spalten oder Zeilen).
 *
 * Wird sowohl für Termine im Zeitraster (Slots = Spalten, Werte = Zeitstempel)
 * als auch für ganztägige Termine (Slots = Zeilen, Werte = Tagesindizes) verwendet.
 */
export function packIntervals<T>(
  items: T[],
  getStart: (item: T) => number,
  getEnd: (item: T) => number,
): PackedInterval<T>[] {
  const sorted = [...items].sort((a, b) => {
    const diff = getStart(a) - getStart(b)
    return diff !== 0 ? diff : getEnd(a) - getEnd(b)
  })

  const result: PackedInterval<T>[] = []
  let cluster: T[] = []
  let clusterEnd = -Infinity

  const flush = () => {
    if (cluster.length === 0) return

    const slotEnds: number[] = []
    const assignments: { item: T; index: number }[] = []

    for (const item of cluster) {
      const start = getStart(item)
      let slot = slotEnds.findIndex((end) => end <= start)
      if (slot === -1) {
        slot = slotEnds.length
        slotEnds.push(getEnd(item))
      } else {
        slotEnds[slot] = getEnd(item)
      }
      assignments.push({ item, index: slot })
    }

    const count = slotEnds.length
    for (const { item, index } of assignments) {
      result.push({ item, index, count })
    }
    cluster = []
  }

  for (const item of sorted) {
    const start = getStart(item)
    if (cluster.length > 0 && start >= clusterEnd) {
      flush()
      clusterEnd = -Infinity
    }
    cluster.push(item)
    clusterEnd = Math.max(clusterEnd, getEnd(item))
  }
  flush()

  return result
}
