import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

type Mode = 'login' | 'register' | 'forgot'

const content: Record<Mode, { title: string; description: string }> = {
  login: { title: 'Anmelden', description: 'Melde dich mit deinem Account an.' },
  register: { title: 'Konto erstellen', description: 'Erstelle ein neues Konto, um die App zu nutzen.' },
  forgot: { title: 'Passwort zurücksetzen', description: 'Wir senden dir einen Link zum Zurücksetzen deines Passworts.' },
}

export function AuthPage() {
  const { user, loading, signUp, signInWithPassword, requestPasswordReset } = useAuth()
  const location = useLocation()

  const [mode, setMode] = useState<Mode>(location.pathname === '/register' ? 'register' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <LoadingScreen />

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'
    return <Navigate to={from} replace />
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setMessage(null)
    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (mode === 'forgot') {
      if (!email) {
        setError('Bitte gib deine E-Mail-Adresse ein.')
        return
      }

      setSubmitting(true)
      const { error } = await requestPasswordReset(email)
      setSubmitting(false)

      if (error) setError(error)
      else setMessage('Falls ein Konto mit dieser E-Mail existiert, wurde dir ein Link zum Zurücksetzen geschickt.')
      return
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
        return
      }

      if (password !== confirmPassword) {
        setError('Die Passwörter stimmen nicht überein.')
        return
      }

      setSubmitting(true)
      const { error, needsEmailConfirmation } = await signUp(email, password)
      setSubmitting(false)

      if (error) {
        setError(error)
      } else if (needsEmailConfirmation) {
        setMessage('Konto erstellt! Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir gesendet haben.')
        setPassword('')
        setConfirmPassword('')
      }
      // Ohne E-Mail-Bestätigung wird der Nutzer automatisch eingeloggt
      // und durch die obige Weiterleitung zur Startseite gebracht.
      return
    }

    setSubmitting(true)
    const { error } = await signInWithPassword(email, password)
    setSubmitting(false)
    if (error) setError(error)
  }

  const { title, description } = content[mode]

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-fg">{title}</h1>
        <p className="mt-1 text-sm text-fg-secondary">{description}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-fg">
              E-Mail
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-fg">
                Passwort
              </label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                minLength={mode === 'register' ? 6 : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-fg">
                Passwort bestätigen
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm text-accent hover:underline"
              >
                Passwort vergessen?
              </button>
            </div>
          )}

          {error && <p className="text-sm text-cal-red">{error}</p>}
          {message && <p className="text-sm text-cal-green">{message}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting
              ? 'Bitte warten…'
              : mode === 'login'
                ? 'Anmelden'
                : mode === 'register'
                  ? 'Konto erstellen'
                  : 'Link senden'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-fg-secondary">
          {mode === 'login' && (
            <>
              Noch kein Konto?{' '}
              <button type="button" onClick={() => switchMode('register')} className="text-accent hover:underline">
                Jetzt registrieren
              </button>
            </>
          )}
          {mode === 'register' && (
            <>
              Bereits ein Konto?{' '}
              <button type="button" onClick={() => switchMode('login')} className="text-accent hover:underline">
                Jetzt anmelden
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <button type="button" onClick={() => switchMode('login')} className="text-accent hover:underline">
              Zurück zum Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
