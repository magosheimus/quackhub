import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAttachment } from '@/services/attachments/attachments'

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
      queryClient.invalidateQueries({ queryKey: ['attachments', taskId] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
