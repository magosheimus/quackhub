import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteTask } from '@/features/tasks/api/tasks'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSoftDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: softDeleteTask,
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({ queryKey: queryKeys.tasks.detail(taskId) })
      invalidateTaskQueries(queryClient)
    },
  })
}
