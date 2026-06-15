import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Sanfter Hover-Lift für interaktive Karten. */
  hover?: boolean
}

/** Premium-Karte: abgerundet, weicher Schatten, dezente Border. */
export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border/60 bg-surface p-5 shadow-soft',
        hover && 'card-hover',
        className,
      )}
      {...props}
    />
  )
}
