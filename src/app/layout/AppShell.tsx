import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileTopBar } from './MobileTopBar'
import { useMobileNav } from './useMobileNav'
import { Drawer } from '@/components/ui/drawer'
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
  const { isMobile, isOpen, setIsOpen } = useMobileNav()

  return (
    <div className="app-root retro-motion flex h-dvh flex-col overflow-hidden bg-page lg:flex-row">
      {isMobile ? (
        <>
          <MobileTopBar onOpenMenu={() => setIsOpen(true)} />
          <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            label={APP_TEXTS.navigation}
          >
            <Sidebar className="w-full border-r-0" />
          </Drawer>
        </>
      ) : (
        <Sidebar />
      )}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        {!isOnline && (
          <div className="mb-4 border border-border bg-surface p-2 text-xs text-warning">
            {APP_TEXTS.offlineBanner}
          </div>
        )}
        {children}
      </main>
      {!isMobile && (
        <div className="fixed right-4 bottom-4 z-40">
          <CartuchoPicker />
        </div>
      )}
    </div>
  )
}
