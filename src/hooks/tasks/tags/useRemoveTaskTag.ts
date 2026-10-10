import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTaskTag } from '@/services/tasks/tasks'
import { invalidateTagQueries } from '@/lib/queryInvalidation'

export function useRemoveTaskTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagName }: { taskId: string; tagName: string }) =>
      removeTaskTag(taskId, tagName),
    onSuccess: () => {
      invalidateTagQueries(queryClient)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
