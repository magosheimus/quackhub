import type { ReactNode } from 'react'

export function PageBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-accent px-3 py-1 text-body-strong text-on-accent">
      {children}
    </span>
  )
}
