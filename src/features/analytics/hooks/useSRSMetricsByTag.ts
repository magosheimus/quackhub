import { useQuery } from '@tanstack/react-query'
import { getSRSMetricsByTag } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSRSMetricsByTag(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.srsByTag(projectId),
    queryFn: () => getSRSMetricsByTag(projectId),
  })
}
