import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTaskToSprint } from '@/services/tasks/tasks'
import type { TaskStatus } from '@/lib/board'

type AddTaskToSprintVars = {
  taskId: string
  sprintId: string
  status: TaskStatus
}

export function useAddTaskToSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, sprintId, status }: AddTaskToSprintVars) =>
      addTaskToSprint(taskId, sprintId, status),
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'backlog', task.project_id],
      })
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'sprint', task.sprint_id],
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
