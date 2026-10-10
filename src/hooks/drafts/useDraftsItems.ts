import { useQuery } from '@tanstack/react-query'
import { getDraftsItems } from '@/services/drafts/drafts'
import { queryKeys } from '@/lib/queryKeys'

export function useDraftsItems() {
  return useQuery({
    queryKey: queryKeys.drafts.root,
    queryFn: getDraftsItems,
  })
}
