import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEpic } from '@/services/epics/epics'
import type { Database } from '@/types/database.types'
import { queryKeys } from '@/lib/queryKeys'

type EpicUpdate = Database['public']['Tables']['epics']['Update']

export function useUpdateEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EpicUpdate }) =>
      updateEpic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.epics.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
