import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/store/useThemeStore'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Wendet das aktuelle Theme als 'dark'-Klasse auf <html> an und reagiert
 * live auf Änderungen der System-Einstellung, solange theme === 'system' ist.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
      root.classList.toggle('dark', isDark)
    }

    applyTheme()

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    }
  }, [theme])

  return <>{children}</>
}
