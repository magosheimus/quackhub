import { useEffect } from 'react'
import { isSettingsShortcut } from '@/features/settings/lib/shortcut'
import { useSettingsToggle } from '@/features/settings/hooks/useSettingsToggle'

export function useSettingsShortcut() {
  const { toggleSettings } = useSettingsToggle()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isSettingsShortcut(event)) {
        event.preventDefault()
        toggleSettings()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSettings])
}
