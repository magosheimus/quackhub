import type { ReactNode } from 'react'
import { Panel } from '@/components/layout/panel'
import { SectionLabel } from '@/components/layout/section-label'

export function ChartCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionLabel>{title}</SectionLabel>
      {children}
    </Panel>
  )
}
