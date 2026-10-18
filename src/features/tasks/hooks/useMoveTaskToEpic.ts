import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/features/tasks/api/tasks'
import { invalidateTaskQueries } from '@/shared/query/queryInvalidation'
import { queryKeys } from '@/shared/query/queryKeys'
import type { Task } from '@/features/tasks/model/task'

type MoveTaskToEpicVars = {
  taskId: string
  epicId: string | null
}

export function useMoveTaskToEpic(projectId: string) {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.tasks.project(projectId)

  return useMutation({
    mutationFn: ({ taskId, epicId }: MoveTaskToEpicVars) =>
      updateTask(taskId, { epicId }),

    onMutate: async ({ taskId, epicId }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey)
      queryClient.setQueryData<Task[]>(queryKey, (tasks) =>
        tasks?.map((task) =>
          task.id === taskId ? { ...task, epic_id: epicId } : task,
        ),
      )
      return { previousTasks }
    },

    onError: (_error, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks)
    },

    onSettled: (_data, _error, { taskId }) => {
      invalidateTaskQueries(queryClient, taskId)
    },
  })
}
