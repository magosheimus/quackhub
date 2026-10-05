import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { syncDraftsQueue } from '@/services/drafts/drafts'
import { useOnlineStatus } from '@/hooks/network/useOnlineStatus'
import { Toaster } from '../ui/toaster'
import { CartuchoPicker } from '../settings/CartuchoPicker'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useEffect(() => {
    window.addEventListener('online', syncDraftsQueue)
    return () => window.removeEventListener('online', syncDraftsQueue)
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
      <div className="fixed right-4 bottom-4 z-40">
        <CartuchoPicker />
      </div>
      <Toaster />
    </div>
  )
}
