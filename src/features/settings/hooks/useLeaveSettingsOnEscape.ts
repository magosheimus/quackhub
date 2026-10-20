import { useEffect } from 'react'
import { useSettingsToggle } from '@/features/settings/hooks/useSettingsToggle'
import { shouldLeaveSettings } from '@/features/settings/lib/shortcut'
import { isEditableTarget } from '@/shared/lib/dom'

const OVERLAY_SELECTOR =
  '[role="dialog"], [role="alertdialog"], [role="listbox"], [role="menu"]'

export function useLeaveSettingsOnEscape() {
  const { leaveSettings } = useSettingsToggle()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const context = {
        isTyping: isEditableTarget(event.target),
        hasOpenOverlay: document.querySelector(OVERLAY_SELECTOR) !== null,
      }
      if (!shouldLeaveSettings(event, context)) {
        return
      }
      leaveSettings()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [leaveSettings])
}
