import { useQuery } from '@tanstack/react-query'
import { getSRSMetricsByTag } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useSRSMetricsByTag(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.srsByTag(projectId),
    queryFn: () => getSRSMetricsByTag(projectId),
  })
}
