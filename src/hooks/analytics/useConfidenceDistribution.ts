import { useQuery } from '@tanstack/react-query'
import { getConfidenceDistribution } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useConfidenceDistribution(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.confidenceDistribution(sprintId),
    queryFn: () => getConfidenceDistribution(sprintId),
  })
}
