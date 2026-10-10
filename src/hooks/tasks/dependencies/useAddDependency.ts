import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDependency } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useAddDependency() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      dependsOnTaskId,
    }: {
      taskId: string
      dependsOnTaskId: string
    }) => addDependency(taskId, dependsOnTaskId),
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
