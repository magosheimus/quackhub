import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addManualComment } from '@/services/srs/srs'

export function useAddManualComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, comment }: { taskId: string; comment: string }) =>
      addManualComment(taskId, comment),
    onSuccess: (_log, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] })
      queryClient.invalidateQueries({ queryKey: ['srs-logs', taskId] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
