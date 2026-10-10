import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTaskStatus } from '@/services/tasks/tasks'
import { invalidateTaskQueries } from '@/lib/queryInvalidation'

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
