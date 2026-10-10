import { useQuery } from '@tanstack/react-query'
import { getInboxItems } from '@/features/inbox/api/inbox'
import { queryKeys } from '@/shared/query/queryKeys'

export function useInboxItems() {
  return useQuery({
    queryKey: queryKeys.inbox.root,
    queryFn: getInboxItems,
  })
}
