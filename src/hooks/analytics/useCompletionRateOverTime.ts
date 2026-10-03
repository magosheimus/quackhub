import { useQuery } from '@tanstack/react-query'
import { getCompletionRateOverTime } from '@/services/analytics/analytics'

export function useCompletionRateOverTime(projectId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'completion-rate-over-time', projectId ?? 'all'],
    queryFn: () => getCompletionRateOverTime(projectId),
  })
}
