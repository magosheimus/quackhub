import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSprint } from '@/services/sprints/sprints'

export function useCreateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSprint,
    onSuccess: (sprint) => {
      queryClient.invalidateQueries({
        queryKey: ['sprints', sprint.project_id],
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
