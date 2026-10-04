import { useQuery } from '@tanstack/react-query'
import { getDraftsItems } from '@/services/drafts/drafts'

export function useDraftsItems() {
  return useQuery({
    queryKey: ['drafts'],
    queryFn: getDraftsItems,
  })
}
