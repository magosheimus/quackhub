import type { ReactNode } from 'react'

export function ChartCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-(--bg-card) p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-(--text-primary)">
        {title}
      </span>
      {children}
    </div>
  )
}
