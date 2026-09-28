import { useQuery } from '@tanstack/react-query'
import { getAttachments } from '@/services/attachments/attachments'

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: ['attachments', taskId],
    queryFn: () => getAttachments(taskId),
    enabled: !!taskId,
  })
}
