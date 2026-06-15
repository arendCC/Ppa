import { AlertTriangle } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function RouteErrorBoundary() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? error.statusText || `Fehler ${error.status}`
    : error instanceof Error
      ? error.message
      : 'Unbekannter Fehler'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <AlertTriangle size={40} className="text-cal-red" />
      <div>
        <h1 className="text-xl font-semibold text-fg">Etwas ist schiefgelaufen</h1>
        <p className="mt-1 text-sm text-fg-secondary">{message}</p>
      </div>
      <Button onClick={() => window.location.reload()}>Seite neu laden</Button>
    </div>
  )
}
