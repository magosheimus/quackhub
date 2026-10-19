import type { ReactNode } from 'react'
import type { IconComponent } from '@/shared/lib/icons'

type PageTitleProps = {
  count?: number
  icon?: IconComponent
  iconSize?: 24 | 48
  withAccentBar?: boolean
} & (
  { title: string; children?: never } | { title?: never; children: ReactNode }
)

export function PageTitle({
  title,
  count,
  icon: Icon,
  iconSize = 24,
  withAccentBar = true,
  children,
}: PageTitleProps) {
  return (
    <div
      className={`flex items-center gap-3 ${withAccentBar ? 'border-l-4 border-accent pl-3' : ''}`}
    >
      {Icon && (
        <Icon size={iconSize} aria-hidden="true" className="text-accent" />
      )}
      {children ?? (
        <span className="font-heading text-3xl uppercase text-fg">{title}</span>
      )}
      {count !== undefined && (
        <span className="flex size-6 items-center justify-center rounded-md border border-border text-xs text-fg-muted">
          {count}
        </span>
      )}
    </div>
  )
}
