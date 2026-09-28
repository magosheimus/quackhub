import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTaskTag } from '@/services/tasks/tasks'

export function useAddTaskTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagName }: { taskId: string; tagName: string }) =>
      addTaskTag(taskId, tagName),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tags', 'task', taskId] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
