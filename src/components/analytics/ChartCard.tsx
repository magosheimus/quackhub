import type { ReactNode } from 'react'

export function SectionTitle({
  children,
  hint,
}: {
  children: string
  hint?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-2">
      <h2 className="font-heading text-xl uppercase text-(--text-primary)">
        {children}
      </h2>
      {hint && <span className="text-xs text-(--text-muted)">{hint}</span>}
    </div>
  )
}

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
