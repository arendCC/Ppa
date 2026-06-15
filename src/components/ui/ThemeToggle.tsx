import { Moon, Sun, Monitor } from 'lucide-react'
import { useThemeStore, type Theme } from '@/store/useThemeStore'
import { clsx } from 'clsx'

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Hell', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dunkel', icon: Moon },
]

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-surface-secondary p-1">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            theme === value
              ? 'bg-accent text-white'
              : 'text-fg-secondary hover:text-fg',
          )}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}
