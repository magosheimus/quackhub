import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeDependency } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useRemoveDependency() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      dependsOnTaskId,
    }: {
      taskId: string
      dependsOnTaskId: string
    }) => removeDependency(taskId, dependsOnTaskId),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dependencies.byTask(taskId),
      })
    },
    onError: (error) => {
      window.alert(error.message)
    },
  })
}
