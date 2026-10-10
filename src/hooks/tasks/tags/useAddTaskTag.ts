import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTaskTag } from '@/services/tasks/tasks'
import { invalidateTagQueries } from '@/lib/queryInvalidation'

export function useAddTaskTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagName }: { taskId: string; tagName: string }) =>
      addTaskTag(taskId, tagName),
    onSuccess: () => {
      invalidateTagQueries(queryClient)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
