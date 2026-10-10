import { useQuery } from '@tanstack/react-query'
import { getActiveSprint } from '@/services/sprints/sprints'
import { queryKeys } from '@/lib/queryKeys'

export function useActiveSprint() {
  return useQuery({
    queryKey: queryKeys.sprints.active,
    queryFn: getActiveSprint,
  })
}
