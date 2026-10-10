import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/services/tasks/tasks'
import { invalidateTaskQueries } from '@/lib/queryInvalidation'
import type { TaskUpdate } from '@/types/entities'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      updateTask(id, data),
    onSuccess: (task) => {
      invalidateTaskQueries(queryClient, task.id)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
