import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/features/auth/AuthProvider'

export function MobileHeader() {
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 pt-[env(safe-area-inset-top)] backdrop-blur-md md:hidden">
      <span className="text-lg font-semibold text-fg">Planner</span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={signOut}
          title="Abmelden"
          aria-label="Abmelden"
          className="flex h-8 w-8 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface-secondary hover:text-fg"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
