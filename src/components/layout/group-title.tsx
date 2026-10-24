import type { CSSProperties } from 'react'
import { cn } from '@/shared/lib/utils'

type GroupTitleProps = {
  children: string
  color: string
  className?: string
}

export function GroupTitle({ children, color, className }: GroupTitleProps) {
  return (
    <span
      className={cn(
        'group-title font-heading text-xl uppercase text-fg',
        className,
      )}
      style={{ '--group-color': color } as CSSProperties}
    >
      {children}
    </span>
  )
}
