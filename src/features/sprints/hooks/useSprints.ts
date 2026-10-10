import { useQuery } from '@tanstack/react-query'
import { getSprints } from '@/features/sprints/api/sprints'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSprints() {
  return useQuery({
    queryKey: queryKeys.sprints.root,
    queryFn: getSprints,
  })
}
