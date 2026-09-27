import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateSprint } from '@/services/sprints/sprints'

export function useStartSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activateSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
