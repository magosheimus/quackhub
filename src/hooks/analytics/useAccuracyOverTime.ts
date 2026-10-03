import { useQuery } from '@tanstack/react-query'
import { getAccuracyOverTime } from '@/services/analytics/analytics'

export function useAccuracyOverTime(projectId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'accuracy-over-time', projectId ?? 'all'],
    queryFn: () => getAccuracyOverTime(projectId),
  })
}
