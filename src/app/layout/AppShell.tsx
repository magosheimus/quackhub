import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { DailyNav } from './DailyNav'
import { useMobileNav } from './useMobileNav'
import { useSidebarCollapse } from './useSidebarCollapse'
import { Drawer } from '@/components/ui/drawer'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { syncDraftsQueue } from '@/features/drafts/api/drafts'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { APP_TEXTS } from '@/app/constants/texts'
import { useSettingsSync } from '@/features/settings/hooks/useSettingsSync'
import { useSettingsShortcut } from '@/features/settings/hooks/useSettingsShortcut'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  useSettingsSync()
  useSettingsShortcut()
  useEffect(() => {
    window.addEventListener('online', syncDraftsQueue)
    return () => window.removeEventListener('online', syncDraftsQueue)
  }, [])
  const isOnline = useOnlineStatus()
  const { isMobile, isOpen, setIsOpen } = useMobileNav()
  const sidebar = useSidebarCollapse()

  return (
    <div className="app-root retro-motion flex h-dvh flex-col overflow-hidden bg-page">
      <TopBar
        isMobile={isMobile}
        isSidebarCollapsed={sidebar.isCollapsed}
        onOpenMenu={() => setIsOpen(true)}
      />
      {isMobile && (
        <Drawer
          open={isOpen}
          onOpenChange={setIsOpen}
          label={APP_TEXTS.navigation}
        >
          <Sidebar
            className="w-full border-r-0"
            header={
              <>
                <CardCreateModal triggerClassName="h-10 w-full text-sm" />
                <DailyNav orientation="vertical" />
              </>
            }
          />
        </Drawer>
      )}
      <div className="flex min-h-0 flex-1">
        {!isMobile && (
          <Sidebar
            isCollapsed={sidebar.isCollapsed}
            onToggleCollapse={sidebar.toggle}
          />
        )}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {!isOnline && (
            <div className="mb-4 border border-border bg-surface p-2 text-xs text-warning">
              {APP_TEXTS.offlineBanner}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
