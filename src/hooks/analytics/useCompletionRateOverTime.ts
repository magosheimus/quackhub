import { useQuery } from '@tanstack/react-query'
import { getCompletionRateOverTime } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useCompletionRateOverTime(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.completionRateOverTime(projectId),
    queryFn: () => getCompletionRateOverTime(projectId),
  })
}
