import { useQuery } from '@tanstack/react-query'
import { getCompletionByProject } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCompletionByProject(sprintId: string | null) {
  return useQuery({
    queryKey: queryKeys.analytics.completionByProject(sprintId),
    queryFn: () => getCompletionByProject(sprintId ?? ''),
    enabled: !!sprintId,
  })
}
