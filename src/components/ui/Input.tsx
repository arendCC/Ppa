import { forwardRef, type InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-fg outline-none transition-colors placeholder:text-fg-tertiary focus:border-accent focus:ring-2 focus:ring-accent/15',
          className,
        )}
        {...props}
      />
    )
  },
)
