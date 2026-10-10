import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/services/tasks/tasks'
import type { Database } from '@/types/database.types'
import { invalidateTaskQueries } from '@/lib/queryInvalidation'

type TaskUpdate = Database['public']['Tables']['tasks']['Update']

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
