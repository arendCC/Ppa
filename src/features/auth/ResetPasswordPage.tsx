import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export function ResetPasswordPage() {
  const { user, loading, updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!success) return
    const timeout = setTimeout(() => navigate('/', { replace: true }), 1500)
    return () => clearTimeout(timeout)
  }, [success, navigate])

  if (loading) return <LoadingScreen />

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-fg">Link ungültig</h1>
          <p className="mt-2 text-sm text-fg-secondary">
            Dieser Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen.
          </p>
          <Link to="/login" className="mt-4 inline-block text-sm text-accent hover:underline">
            Zurück zum Login
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }

    setSubmitting(true)
    const { error } = await updatePassword(password)
    setSubmitting(false)

    if (error) setError(error)
    else setSuccess(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-fg">Neues Passwort festlegen</h1>
        <p className="mt-1 text-sm text-fg-secondary">Wähle ein neues Passwort für dein Konto.</p>

        {success ? (
          <p className="mt-6 text-sm text-cal-green">Passwort wurde geändert. Du wirst weitergeleitet…</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-fg">
                Neues Passwort
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-fg">
                Passwort bestätigen
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            {error && <p className="text-sm text-cal-red">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Speichern…' : 'Passwort speichern'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
