import { useQuery } from '@tanstack/react-query'
import { getSrsLogs } from '@/services/srs/srs'

export function useSrsLogs(taskId: string) {
  return useQuery({
    queryKey: ['srs-logs', taskId],
    queryFn: () => getSrsLogs(taskId),
    enabled: !!taskId,
  })
}
