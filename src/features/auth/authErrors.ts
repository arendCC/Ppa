const messages: Record<string, string> = {
  'Invalid login credentials': 'E-Mail oder Passwort ist falsch.',
  'Email not confirmed': 'Diese E-Mail-Adresse wurde noch nicht bestätigt.',
  'User not found': 'Es existiert kein Konto mit dieser E-Mail-Adresse.',
  'Password should be at least 6 characters': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  'New password should be different from the old password':
    'Das neue Passwort muss sich vom alten unterscheiden.',
  'User already registered': 'Für diese E-Mail-Adresse existiert bereits ein Konto. Bitte melde dich an.',
  'Unable to validate email address: invalid format': 'Bitte gib eine gültige E-Mail-Adresse ein.',
  'Signup requires a valid password': 'Bitte gib ein gültiges Passwort ein.',
  'Failed to fetch':
    'Verbindung zu Supabase fehlgeschlagen. Bitte überprüfe deine Internetverbindung und die Supabase-Konfiguration (.env).',
}

const patterns: { test: RegExp; message: string }[] = [
  { test: /rate limit/i, message: 'Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.' },
  { test: /after \d+ seconds?/i, message: 'Bitte warte einen Moment, bevor du es erneut versuchst.' },
  { test: /email address .* is invalid/i, message: 'Diese E-Mail-Adresse ist ungültig.' },
]

export function translateAuthError(message: string): string {
  if (messages[message]) return messages[message]

  const pattern = patterns.find((entry) => entry.test.test(message))
  return pattern?.message ?? message
}
