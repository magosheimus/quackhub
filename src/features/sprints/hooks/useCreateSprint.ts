import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSprint } from '@/features/sprints/api/sprints'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCreateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints.root })
    },
  })
}
