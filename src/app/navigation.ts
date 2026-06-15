import {
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  NotebookText,
  Target,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Kalender', icon: CalendarDays },
  { to: '/tasks', label: 'Aufgaben', icon: CheckSquare },
  { to: '/goals', label: 'Ziele', icon: Target },
  { to: '/notes', label: 'Notizen', icon: NotebookText },
  { to: '/stats', label: 'Statistiken', icon: BarChart3 },
]
