import type { ReactNode } from 'react'
import type { IconComponent } from '@/shared/lib/icons'

type InlineHintProps = {
  icon: IconComponent
  children: ReactNode
}

export function InlineHint({ icon: Icon, children }: InlineHintProps) {
  return (
    <p className="flex items-center gap-2 text-xs text-fg">
      <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
      {children}
    </p>
  )
}
