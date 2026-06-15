import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { navItems } from '@/app/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/features/auth/AuthProvider'

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-surface px-3 py-4 md:flex">
      <div className="px-3 pb-4 pt-2">
        <span className="text-lg font-semibold text-fg">Planner</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-fg-secondary hover:bg-surface-secondary hover:text-fg',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-3 pt-4">
        <p className="truncate px-1 text-xs text-fg-secondary" title={user?.email}>
          {user?.email}
        </p>
        <div className="mt-3 flex items-center justify-between">
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
      </div>
    </aside>
  )
}
