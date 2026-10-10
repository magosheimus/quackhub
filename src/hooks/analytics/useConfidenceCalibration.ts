import { useQuery } from '@tanstack/react-query'
import { getConfidenceCalibration } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useConfidenceCalibration(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.confidenceCalibration(sprintId),
    queryFn: () => getConfidenceCalibration(sprintId),
  })
}
