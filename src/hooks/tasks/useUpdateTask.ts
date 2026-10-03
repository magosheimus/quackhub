import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/services/tasks/tasks'
import type { Database } from '@/types/database.types'

type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      updateTask(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'detail', task.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'backlog', task.project_id],
      })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'backlog', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project'] })
      if (task.sprint_id) {
        queryClient.invalidateQueries({
          queryKey: ['tasks', 'sprint', task.sprint_id],
        })
      }
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
