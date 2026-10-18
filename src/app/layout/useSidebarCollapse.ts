import { useEffect } from 'react'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { isSidebarShortcut } from '@/features/settings/lib/shortcut'
import { isEditableTarget } from '@/shared/lib/dom'

export function useSidebarCollapse() {
  const { settings, updateSettings } = useSettings()
  const isCollapsed = settings.sidebarCollapsed

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isSidebarShortcut(event) && !isEditableTarget(event.target)) {
        event.preventDefault()
        updateSettings({ sidebarCollapsed: !isCollapsed })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCollapsed, updateSettings])

  return {
    isCollapsed,
    toggle: () => updateSettings({ sidebarCollapsed: !isCollapsed }),
  }
}
