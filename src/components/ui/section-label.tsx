import type { ReactNode } from 'react'
import type { IconComponent } from '@/shared/lib/icons'

type SectionLabelProps = {
  icon: IconComponent
  children: ReactNode
  htmlFor?: string
}

const SECTION_LABEL_CLASS =
  'flex items-center gap-1.5 text-sm font-medium text-fg'

export function SectionLabel({
  icon: Icon,
  children,
  htmlFor,
}: SectionLabelProps) {
  const content = (
    <>
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      {children}
    </>
  )

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={SECTION_LABEL_CLASS}>
        {content}
      </label>
    )
  }

  return <span className={SECTION_LABEL_CLASS}>{content}</span>
}
