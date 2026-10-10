import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSprint } from '@/services/sprints/sprints'
import type { Database } from '@/types/database.types'
import { queryKeys } from '@/lib/queryKeys'

type SprintUpdate = Database['public']['Tables']['sprints']['Update']

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
    onError: (error) => {
      console.error(error.message)
    },
  })
}
