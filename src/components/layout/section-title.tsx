import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type SectionTitleProps = {
  children: string
  hint?: string
  className?: string
  marker?: ReactNode
}

export function SectionTitle({
  children,
  hint,
  className,
  marker,
}: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-2">
      <h2
        className={cn(
          'flex items-center gap-2 font-heading text-heading-2 text-fg',
          className,
        )}
      >
        {marker}
        {children}
      </h2>
      {hint && <span className="text-xs text-fg-muted">{hint}</span>}
    </div>
  )
}
