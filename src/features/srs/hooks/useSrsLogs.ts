import { useQuery } from '@tanstack/react-query'
import { getSrsLogs } from '@/features/srs/api/srs'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSrsLogs(taskId: string) {
  return useQuery({
    queryKey: queryKeys.srsLogs.byTask(taskId),
    queryFn: () => getSrsLogs(taskId),
    enabled: !!taskId,
  })
}
