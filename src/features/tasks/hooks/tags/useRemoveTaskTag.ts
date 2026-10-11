import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTaskTag } from '@/features/tasks/api/tasks'
import { invalidateTagQueries } from '@/shared/query/queryInvalidation'

export function useRemoveTaskTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagName }: { taskId: string; tagName: string }) =>
      removeTaskTag(taskId, tagName),
    onSuccess: () => {
      invalidateTagQueries(queryClient)
    },
  })
}
