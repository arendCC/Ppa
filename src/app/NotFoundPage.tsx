import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <div>
        <h1 className="text-xl font-semibold text-fg">Seite nicht gefunden</h1>
        <p className="mt-1 text-sm text-fg-secondary">Diese Seite existiert nicht oder wurde verschoben.</p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Zur Startseite
      </Link>
    </div>
  )
}
