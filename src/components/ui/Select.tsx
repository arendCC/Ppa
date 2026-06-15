import { forwardRef, type SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={clsx(
          'rounded-xl border border-border bg-surface-secondary px-3.5 py-2.5 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/15',
          className,
        )}
        {...props}
      />
    )
  },
)
