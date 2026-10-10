import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTaskToSprint } from '@/services/tasks/tasks'
import { invalidateTaskQueries } from '@/lib/queryInvalidation'
import { queryKeys } from '@/lib/queryKeys'
import type { Task, TaskStatus } from '@/types/entities'

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

    onError: (error, _vars, context) => {
      window.alert(error.message)
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
