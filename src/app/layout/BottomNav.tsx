import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { navItems } from '@/app/navigation'

export function BottomNav() {
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-10 flex border-t border-border/60 pb-[env(safe-area-inset-bottom)] shadow-soft-lg md:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-accent' : 'text-fg-secondary',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="w-full truncate text-center">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
