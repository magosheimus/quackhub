import { useQuery } from '@tanstack/react-query'
import { getConfidenceDistribution } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useConfidenceDistribution(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.confidenceDistribution(sprintId),
    queryFn: () => getConfidenceDistribution(sprintId),
  })
}
