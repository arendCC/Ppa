import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { clsx } from 'clsx'
import { navItems } from '@/app/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/features/auth/AuthProvider'

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="glass hidden w-72 flex-col border-r border-border/60 px-4 py-6 md:flex">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="bg-accent-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white shadow-soft">
          P
        </div>
        <span className="text-xl font-semibold tracking-tight text-fg">Planner</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-surface text-accent shadow-soft'
                  : 'text-fg-secondary hover:bg-surface/60 hover:text-fg',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/60 px-2 pt-4">
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
            className="flex h-9 w-9 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface hover:text-fg"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
