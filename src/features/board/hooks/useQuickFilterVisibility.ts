import { useSettings } from '@/features/settings/hooks/useSettings'
import {
  quickFilterKey,
  type QuickFilterKind,
} from '@/features/board/lib/board'
import { toggleItem } from '@/shared/lib/array'

export function useQuickFilterVisibility() {
  const { settings, updateSettings } = useSettings()
  const hidden = settings.hiddenQuickFilters

  return {
    hidden,
    isVisible: (kind: QuickFilterKind, id: string) =>
      !hidden.includes(quickFilterKey(kind, id)),
    toggle: (kind: QuickFilterKind, id: string) =>
      updateSettings({
        hiddenQuickFilters: toggleItem(hidden, quickFilterKey(kind, id)),
      }),
  }
}
