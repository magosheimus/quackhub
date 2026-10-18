import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTaskToSprint } from '@/features/tasks/api/tasks'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'
import { queryKeys } from '@/shared/query/queryKeys'
import type { TaskStatus } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'

type AddTaskToSprintVars = {
  taskId: string
  sprintId: string
  status: TaskStatus
  projectId: string
}

export function useAddTaskToSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, sprintId, status }: AddTaskToSprintVars) =>
      addTaskToSprint(taskId, sprintId, status),

    onMutate: async ({ taskId, projectId }) => {
      const keys = [
        queryKeys.tasks.backlog(projectId),
        queryKeys.tasks.backlog(),
      ]
      await Promise.all(
        keys.map((key) => queryClient.cancelQueries({ queryKey: key })),
      )

      const previous = keys.map((key) => queryClient.getQueryData<Task[]>(key))

      keys.forEach((key) => {
        queryClient.setQueryData<Task[]>(key, (old) =>
          old?.filter((task) => task.id !== taskId),
        )
      })

      return { keys, previous }
    },

    onError: (_error, _vars, context) => {
      if (context) {
        context.keys.forEach((key, i) => {
          queryClient.setQueryData(key, context.previous[i])
        })
      }
    },

    onSettled: (_task, _error, { taskId }) => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}
