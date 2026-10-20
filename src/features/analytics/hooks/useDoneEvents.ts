import { useQuery } from '@tanstack/react-query'
import { getDoneEvents } from '@/features/analytics/api/analytics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useDoneEvents(sprintId: string | null, taskIds: string[]) {
  return useQuery({
    queryKey: queryKeys.analytics.doneEvents(sprintId),
    queryFn: () => getDoneEvents(taskIds),
    enabled: sprintId !== null && taskIds.length > 0,
  })
}
