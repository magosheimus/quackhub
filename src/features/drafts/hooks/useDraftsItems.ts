import { useQuery } from '@tanstack/react-query'
import { getDraftsItems } from '@/features/drafts/api/drafts'
import { queryKeys } from '@/shared/query/queryKeys'

export function useDraftsItems() {
  return useQuery({
    queryKey: queryKeys.drafts.root,
    queryFn: getDraftsItems,
  })
}
