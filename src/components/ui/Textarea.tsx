import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-xl border border-border bg-surface-secondary px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-tertiary focus:border-accent focus:ring-2 focus:ring-accent/15',
          className,
        )}
        {...props}
      />
    )
  },
)
