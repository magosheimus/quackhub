import { useQuery } from '@tanstack/react-query'
import { getActiveSprint } from '@/features/sprints/api/sprints'
import { queryKeys } from '@/shared/query/queryKeys'

export function useActiveSprint() {
  return useQuery({
    queryKey: queryKeys.sprints.active,
    queryFn: getActiveSprint,
  })
}
