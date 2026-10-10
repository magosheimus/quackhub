import { useQuery } from '@tanstack/react-query'
import { getActivityLog } from '@/features/tasks/api/activityLog'
import { queryKeys } from '@/shared/query/queryKeys'

export function useActivityLog(taskId: string) {
  return useQuery({
    queryKey: queryKeys.activityLog.byTask(taskId),
    queryFn: () => getActivityLog(taskId),
    enabled: !!taskId,
  })
}
