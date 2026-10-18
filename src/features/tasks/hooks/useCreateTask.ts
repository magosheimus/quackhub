import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskWithRelations } from '@/features/tasks/api/tasks'
import {
  invalidateTagQueries,
  invalidateTaskQueries,
} from '@/shared/query/queryInvalidation'
import type { NewTask } from '@/features/tasks/model/task'

type CreateTaskVars = {
  data: NewTask
  tags: string[]
  dependsOnTaskIds: string[]
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, tags, dependsOnTaskIds }: CreateTaskVars) =>
      createTaskWithRelations(data, tags, dependsOnTaskIds),
    onSuccess: (task) => {
      invalidateTaskQueries(queryClient, task.id)
      invalidateTagQueries(queryClient)
    },
  })
}
