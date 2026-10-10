import { useQuery } from '@tanstack/react-query'
import { getInboxItems } from '@/services/inbox/inbox'
import { queryKeys } from '@/lib/queryKeys'

export function useInboxItems() {
  return useQuery({
    queryKey: queryKeys.inbox.root,
    queryFn: getInboxItems,
  })
}
