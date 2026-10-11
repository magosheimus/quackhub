import type { ReactNode } from 'react'
import { Panel } from '@/components/ui/panel'

export function ChartCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-fg">
        {title}
      </span>
      {children}
    </Panel>
  )
}
