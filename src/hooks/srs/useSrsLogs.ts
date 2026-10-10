import { useQuery } from '@tanstack/react-query'
import { getSrsLogs } from '@/services/srs/srs'
import { queryKeys } from '@/lib/queryKeys'

export function useSrsLogs(taskId: string) {
  return useQuery({
    queryKey: queryKeys.srsLogs.byTask(taskId),
    queryFn: () => getSrsLogs(taskId),
    enabled: !!taskId,
  })
}
