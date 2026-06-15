import { type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        variant === 'primary' && 'bg-accent-gradient text-white shadow-soft hover:shadow-soft-lg',
        variant === 'secondary' &&
          'border border-border/60 bg-surface-secondary text-fg hover:bg-border/60',
        variant === 'ghost' && 'text-fg-secondary hover:bg-surface-secondary hover:text-fg',
        className,
      )}
      {...props}
    />
  )
}
