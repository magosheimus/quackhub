import { useQuery } from '@tanstack/react-query'
import { getSRSMetricsByTag } from '@/services/analytics/analytics'

export function useSRSMetricsByTag(projectId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'srs-by-tag', projectId ?? 'all'],
    queryFn: () => getSRSMetricsByTag(projectId),
  })
}
