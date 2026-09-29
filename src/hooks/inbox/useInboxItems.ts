import { useQuery } from '@tanstack/react-query'
import { getInboxItems } from '@/services/inbox/inbox'

export function useInboxItems() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: getInboxItems,
  })
}
