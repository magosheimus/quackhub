import { useQuery } from '@tanstack/react-query'
import { getAccuracyOverTime } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useAccuracyOverTime(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.accuracyOverTime(sprintId),
    queryFn: () => getAccuracyOverTime(sprintId),
  })
}
