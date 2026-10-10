import { useQuery } from '@tanstack/react-query'
import { getCompletionRateOverTime } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCompletionRateOverTime(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.completionRateOverTime(projectId),
    queryFn: () => getCompletionRateOverTime(projectId),
  })
}
