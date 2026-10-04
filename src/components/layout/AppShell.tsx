import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { syncInboxQueue } from '@/services/inbox/inbox'
import { useOnlineStatus } from '@/hooks/network/useOnlineStatus'
import { Toaster } from '../ui/toaster'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useEffect(() => {
    window.addEventListener('online', syncInboxQueue)
    return () => window.removeEventListener('online', syncInboxQueue)
  }, [])
  const isOnline = useOnlineStatus()
  return (
    <div className="app-root retro-motion flex h-screen overflow-hidden bg-(--bg-page)">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {!isOnline && (
          <div className="mb-4 border border-border bg-(--bg-surface) p-2 text-xs text-(--signal-warning)">
            Modo offline — Inbox disponível
          </div>
        )}
        {children}
      </main>
      <Toaster />
    </div>
  )
}
