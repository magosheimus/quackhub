import { useQuery } from '@tanstack/react-query'
import { getAttachments } from '@/services/attachments/attachments'
import { queryKeys } from '@/lib/queryKeys'

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: queryKeys.attachments.byTask(taskId),
    queryFn: () => getAttachments(taskId),
    enabled: !!taskId,
  })
}
