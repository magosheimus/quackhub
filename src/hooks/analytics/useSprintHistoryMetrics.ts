import { useQuery } from '@tanstack/react-query'
import { getSprintHistory } from '@/services/analytics/analytics'

export function useSprintHistoryMetrics(projectId?: string | null) {
  return useQuery({
    queryKey: ['analytics', 'sprint-history', projectId ?? 'all'],
    queryFn: () => getSprintHistory(projectId),
  })
}
