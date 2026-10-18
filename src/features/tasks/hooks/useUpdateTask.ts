import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/features/tasks/api/tasks'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'
import type { TaskUpdate } from '@/features/tasks/model/task'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      updateTask(id, data),
    onSuccess: (task) => {
      invalidateTaskQueries(queryClient, task.id)
    },
  })
}
