import type { ReactNode } from 'react'
import type { IconComponent } from '@/shared/lib/icons'

type EmptyStateProps = {
  icon: IconComponent
  title: string
  description: string
  children?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-(--border-card-empty) bg-card-empty px-6 py-12 text-center">
      <Icon size={24} aria-hidden="true" className="text-fg-muted" />
      <div className="flex flex-col gap-1">
        <span className="font-heading text-2xl text-fg">{title}</span>
        <span className="text-subtle">{description}</span>
      </div>
      {children && (
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {children}
        </div>
      )}
    </div>
  )
}
