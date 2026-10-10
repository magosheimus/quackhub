import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addManualComment } from '@/features/srs/api/srs'
import { queryKeys } from '@/shared/query/queryKeys'

export function useAddManualComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, comment }: { taskId: string; comment: string }) =>
      addManualComment(taskId, comment),
    onSuccess: (_log, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(taskId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.srsLogs.byTask(taskId),
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
