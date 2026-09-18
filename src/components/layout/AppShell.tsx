import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[--bg-page]">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
