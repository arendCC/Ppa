import { useEffect, useState } from 'react'

/** Liefert die aktuelle Zeit und aktualisiert sie periodisch (für die "Jetzt"-Linie im Zeitraster). */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
