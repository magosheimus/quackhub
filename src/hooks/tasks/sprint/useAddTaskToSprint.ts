import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTaskToSprint } from '@/services/tasks/tasks'
import type { TaskStatus } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

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
        ['tasks', 'backlog', projectId],
        ['tasks', 'backlog', 'all'],
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

    onSettled: (task, _error, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'backlog', projectId],
      })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'backlog', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project'] })
      if (task) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', 'sprint', task.sprint_id],
        })
      }
    },
  })
}
