import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTaskTag } from '@/services/tasks/tasks'

export function useRemoveTaskTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagName }: { taskId: string; tagName: string }) =>
      removeTaskTag(taskId, tagName),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tags', 'task', taskId] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
