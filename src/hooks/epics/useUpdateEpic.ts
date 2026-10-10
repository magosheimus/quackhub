import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEpic } from '@/services/epics/epics'
import { queryKeys } from '@/lib/queryKeys'
import type { EpicUpdate } from '@/types/entities'

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
