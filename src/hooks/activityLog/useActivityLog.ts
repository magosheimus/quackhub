import { useQuery } from '@tanstack/react-query'
import { getActivityLog } from '@/services/activityLog/activityLog'
import { queryKeys } from '@/lib/queryKeys'

export function useActivityLog(taskId: string) {
  return useQuery({
    queryKey: queryKeys.activityLog.byTask(taskId),
    queryFn: () => getActivityLog(taskId),
    enabled: !!taskId,
  })
}
