import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HOME_PATH } from '@/features/auth/lib/redirect'
import { shouldLeaveSettings } from '@/features/settings/lib/shortcut'

const OVERLAY_SELECTOR =
  '[role="dialog"], [role="alertdialog"], [role="listbox"], [role="menu"]'

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

export function useLeaveSettingsOnEscape() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasPreviousPage = location.key !== 'default'

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const context = {
        isTyping: isEditable(event.target),
        hasOpenOverlay: document.querySelector(OVERLAY_SELECTOR) !== null,
      }
      if (!shouldLeaveSettings(event, context)) {
        return
      }
      if (hasPreviousPage) {
        navigate(-1)
        return
      }
      navigate(HOME_PATH)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, hasPreviousPage])
}
