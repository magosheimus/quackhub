import type { ReactNode } from 'react'

// Selo ao lado do título da página (ex.: período da sprint, data de hoje)
export function PageBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-accent px-3 py-1 text-body-strong text-on-accent">
      {children}
    </span>
  )
}
