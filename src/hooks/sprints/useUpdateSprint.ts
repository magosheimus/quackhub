import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSprint } from '@/services/sprints/sprints'
import type { Database } from '@/types/database.types'

type SprintUpdate = Database['public']['Tables']['sprints']['Update']

export function useUpdateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SprintUpdate }) =>
      updateSprint(id, data),
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
