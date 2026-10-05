import { useQuery } from '@tanstack/react-query'
import { getConfidenceDistribution } from '@/services/analytics/analytics'

export function useConfidenceDistribution(sprintId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'confidence-distribution', sprintId ?? 'all'],
    queryFn: () => getConfidenceDistribution(sprintId),
  })
}
