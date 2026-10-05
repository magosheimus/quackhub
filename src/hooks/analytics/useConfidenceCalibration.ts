import { useQuery } from '@tanstack/react-query'
import { getConfidenceCalibration } from '@/services/analytics/analytics'

export function useConfidenceCalibration(sprintId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'confidence-calibration', sprintId ?? 'all'],
    queryFn: () => getConfidenceCalibration(sprintId),
  })
}
