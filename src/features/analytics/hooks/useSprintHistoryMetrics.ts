import { useQuery } from '@tanstack/react-query'
import { getSprintHistory } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSprintHistoryMetrics(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.sprintHistory(projectId),
    queryFn: () => getSprintHistory(projectId),
  })
}
