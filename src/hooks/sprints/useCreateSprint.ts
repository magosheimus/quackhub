import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSprint } from '@/services/sprints/sprints'
import { queryKeys } from '@/lib/queryKeys'

export function useCreateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
