import { useDraftsItems } from '@/features/drafts/hooks/useDraftsItems'
import { splitDrafts } from '@/features/drafts/lib/drafts'

export function useDraftsSections() {
  const itemsQuery = useDraftsItems()
  const { pending, archived } = splitDrafts(itemsQuery.data ?? [])
  return { itemsQuery, pending, archived }
}
