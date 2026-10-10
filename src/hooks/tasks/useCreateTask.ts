import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskWithTags } from '@/services/tasks/tasks'
import type { Database } from '@/types/database.types'
import {
  invalidateTagQueries,
  invalidateTaskQueries,
} from '@/lib/queryInvalidation'

type NewTask = Database['public']['Tables']['tasks']['Insert']

type CreateTaskVars = {
  data: NewTask
  tags: string[]
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, tags }: CreateTaskVars) =>
      createTaskWithTags(data, tags),
    onSuccess: (task) => {
      invalidateTaskQueries(queryClient, task.id)
      invalidateTagQueries(queryClient)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
