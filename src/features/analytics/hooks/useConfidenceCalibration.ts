import { useQuery } from '@tanstack/react-query'
import { getConfidenceCalibration } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useConfidenceCalibration(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.confidenceCalibration(sprintId),
    queryFn: () => getConfidenceCalibration(sprintId),
  })
}
