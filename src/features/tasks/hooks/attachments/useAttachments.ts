import { useQuery } from '@tanstack/react-query'
import { getAttachments } from '@/features/tasks/api/attachments'
import { queryKeys } from '@/shared/query/queryKeys'

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: queryKeys.attachments.byTask(taskId),
    queryFn: () => getAttachments(taskId),
    enabled: !!taskId,
  })
}
