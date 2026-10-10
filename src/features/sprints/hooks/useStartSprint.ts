import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateSprint } from '@/features/sprints/api/sprints'
import { queryKeys } from '@/shared/query/queryKeys'

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
