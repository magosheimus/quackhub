import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTaskStatus } from '@/features/tasks/api/tasks'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => updateTaskStatus(id, 'done'),
    onSuccess: (task) => {
      invalidateTaskQueries(queryClient, task.id)
    },
    onError: (error) => {
      window.alert(error.message)
    },
  })
}
