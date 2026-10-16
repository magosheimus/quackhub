import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SETTINGS_PATH } from '@/features/settings/constants/paths'
import { isSettingsShortcut } from '@/features/settings/lib/shortcut'

export function useSettingsShortcut() {
  const navigate = useNavigate()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isSettingsShortcut(event)) {
        event.preventDefault()
        navigate(SETTINGS_PATH)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}
