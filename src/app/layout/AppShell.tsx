import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { syncDraftsQueue } from '@/features/drafts/api/drafts'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { CartuchoPicker } from '@/features/settings/components/CartuchoPicker'
import { APP_TEXTS } from '@/app/constants/texts'
import { useSettingsSync } from '@/features/settings/hooks/useSettingsSync'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useSettingsSync()
  useEffect(() => {
    window.addEventListener('online', syncDraftsQueue)
    return () => window.removeEventListener('online', syncDraftsQueue)
  }, [])
  const isOnline = useOnlineStatus()
  return (
    <div className="app-root retro-motion flex h-screen overflow-hidden bg-page">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {!isOnline && (
          <div className="mb-4 border border-border bg-surface p-2 text-xs text-warning">
            {APP_TEXTS.offlineBanner}
          </div>
        )}
        {children}
      </main>
      <div className="fixed right-4 bottom-4 z-40">
        <CartuchoPicker />
      </div>
    </div>
  )
}
