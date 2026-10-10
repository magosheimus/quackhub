import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAttachment } from '@/features/tasks/api/attachments'
import { queryKeys } from '@/shared/query/queryKeys'

export function useUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: string; file: File }) =>
      uploadAttachment(taskId, file),
    onSuccess: (attachment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attachments.byTask(attachment.task_id),
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
