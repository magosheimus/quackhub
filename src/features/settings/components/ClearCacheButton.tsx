import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { SETTINGS_TEXTS } from '@/features/settings/constants/texts'
import { clearQueryCache } from '@/shared/lib/localData'

export function ClearCacheButton() {
  const queryClient = useQueryClient()

  function handleClearCache() {
    clearQueryCache(queryClient)
    window.location.reload()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClearCache}>
      {SETTINGS_TEXTS.clearCache}
    </Button>
  )
}
