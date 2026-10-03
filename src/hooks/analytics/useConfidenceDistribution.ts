import { useQuery } from '@tanstack/react-query'
import { getConfidenceDistribution } from '@/services/analytics/analytics'

export function useConfidenceDistribution(projectId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'confidence-distribution', projectId ?? 'all'],
    queryFn: () => getConfidenceDistribution(projectId),
  })
}
