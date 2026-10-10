import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskWithTags } from '@/services/tasks/tasks'
import {
  invalidateTagQueries,
  invalidateTaskQueries,
} from '@/lib/queryInvalidation'
import type { NewTask } from '@/types/entities'

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
