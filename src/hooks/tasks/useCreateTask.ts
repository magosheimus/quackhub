import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskWithTags } from '@/services/tasks/tasks'
import type { Database } from '@/types/database.types'

type NewTask = Database['public']['Tables']['tasks']['Insert']

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
      queryClient.invalidateQueries({
        queryKey: ['tasks', 'backlog', task.project_id],
      })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'backlog', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['tags', task.project_id] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
