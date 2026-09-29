import { useQuery } from '@tanstack/react-query'
import { getActivityLog } from '@/services/activityLog/activityLog'

export function useActivityLog(taskId: string) {
  return useQuery({
    queryKey: ['activity-log', taskId],
    queryFn: () => getActivityLog(taskId),
    enabled: !!taskId,
  })
}
