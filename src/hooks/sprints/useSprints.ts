import { useQuery } from '@tanstack/react-query'
import { getSprints } from '@/services/sprints/sprints'
import { queryKeys } from '@/lib/queryKeys'

export function useSprints() {
  return useQuery({
    queryKey: queryKeys.sprints.root,
    queryFn: getSprints,
  })
}
