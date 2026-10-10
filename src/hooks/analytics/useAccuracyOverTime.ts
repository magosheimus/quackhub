import { useQuery } from '@tanstack/react-query'
import { getAccuracyOverTime } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useAccuracyOverTime(sprintId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.accuracyOverTime(sprintId),
    queryFn: () => getAccuracyOverTime(sprintId),
  })
}
