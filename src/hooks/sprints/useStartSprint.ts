import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateSprint } from '@/services/sprints/sprints'
import { queryKeys } from '@/lib/queryKeys'

export function useStartSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activateSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
