import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { syncInboxQueue } from '@/services/inbox/inbox'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useEffect(() => {
    window.addEventListener('online', syncInboxQueue)
    return () => window.removeEventListener('online', syncInboxQueue)
  }, [])
  return (
    <div className="app-root retro-motion flex min-h-screen bg-(--bg-page)">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
