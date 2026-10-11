import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAttachment } from '@/features/tasks/api/attachments'
import { queryKeys } from '@/shared/query/queryKeys'

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      storagePath,
    }: {
      id: string
      storagePath: string
      taskId: string
    }) => deleteAttachment(id, storagePath),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attachments.byTask(taskId),
      })
    },
  })
}
