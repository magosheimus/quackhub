import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'

export function ClearCacheButton() {
  const queryClient = useQueryClient()

  function handleClearCache() {
    queryClient.clear()
    localStorage.removeItem('quackhub-query-cache')
    window.location.reload()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClearCache}>
      {SETTINGS_TEXTS.clearCache}
    </Button>
  )
}
