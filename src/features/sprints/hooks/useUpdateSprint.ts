import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSprint } from '@/features/sprints/api/sprints'
import { queryKeys } from '@/shared/query/queryKeys'
import type { SprintUpdate } from '@/shared/types/entities'

export function useUpdateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SprintUpdate }) =>
      updateSprint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sprints.root,
      })
    },
  })
}
