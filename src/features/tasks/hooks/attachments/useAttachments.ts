import { useQuery } from '@tanstack/react-query'
import { getAttachments } from '@/features/tasks/api/attachments'
import { queryKeys } from '@/shared/query/queryKeys'
import { SIGNED_URL_REFRESH_MS } from '@/features/tasks/constants/attachments'

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: queryKeys.attachments.byTask(taskId),
    queryFn: () => getAttachments(taskId),
    enabled: !!taskId,
    staleTime: SIGNED_URL_REFRESH_MS,
    refetchInterval: SIGNED_URL_REFRESH_MS,
    meta: { persist: false },
  })
}
