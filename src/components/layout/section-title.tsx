import type { ReactNode } from 'react'

type SectionTitleProps = {
  children: string
  marker?: ReactNode
}

export function SectionTitle({ children, marker }: SectionTitleProps) {
  return (
    <div className="border-b border-border pb-2">
      <h2 className="flex items-center gap-2 font-heading text-heading-2 text-fg">
        {marker}
        {children}
      </h2>
    </div>
  )
}
