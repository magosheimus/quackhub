import { useQuery } from '@tanstack/react-query'
import { getCompletionByProject } from '@/services/analytics/analytics'
import { queryKeys } from '@/lib/queryKeys'

export function useCompletionByProject(sprintId: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.completionByProject(sprintId),
    queryFn: () => getCompletionByProject(sprintId ?? ''),
    enabled: !!sprintId,
  })
}
