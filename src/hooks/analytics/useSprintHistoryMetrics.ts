import { useQuery } from '@tanstack/react-query'
import { getSprintHistory } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useSprintHistoryMetrics(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.sprintHistory(projectId),
    queryFn: () => getSprintHistory(projectId),
  })
}
