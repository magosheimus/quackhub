import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskWithTags } from '@/features/tasks/api/tasks'
import {
  invalidateTagQueries,
  invalidateTaskQueries,
} from '@/shared/query/queryInvalidation'
import type { NewTask } from '@/shared/types/entities'

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
