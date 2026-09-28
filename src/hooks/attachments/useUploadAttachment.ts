import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAttachment } from '@/services/attachments/attachments'

export function useUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: string; file: File }) =>
      uploadAttachment(taskId, file),
    onSuccess: (attachment) => {
      queryClient.invalidateQueries({
        queryKey: ['attachments', attachment.task_id],
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
