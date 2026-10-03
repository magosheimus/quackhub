import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTaskStatus } from '@/services/tasks/tasks'
import type { TaskStatus } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type UpdateTaskStatusVars = {
  id: string
  status: TaskStatus
  sprintId: string
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: UpdateTaskStatusVars) =>
      updateTaskStatus(id, status),

    onMutate: async ({ id, status, sprintId }) => {
      const queryKey = ['tasks', 'sprint', sprintId]
      await queryClient.cancelQueries({ queryKey })

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey)

      queryClient.setQueryData<Task[]>(queryKey, (old) => {
        if (!old) return old
        const movedTask = old.find((task) => task.id === id)
        if (!movedTask) return old
        const rest = old.filter((task) => task.id !== id)
        return [
          { ...movedTask, status, updated_at: new Date().toISOString() },
          ...rest,
        ]
      })

      return { previousTasks, queryKey }
    },

    onError: (error, _vars, context) => {
      window.alert(error.message)
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousTasks)
      }
    },

    onSettled: (_data, _error, { sprintId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'sprint', sprintId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project'] })
    },
  })
}
