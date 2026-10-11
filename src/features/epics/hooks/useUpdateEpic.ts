import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEpic } from '@/features/epics/api/epics'
import { queryKeys } from '@/shared/query/queryKeys'
import type { EpicUpdate } from '@/shared/types/entities'

export function useUpdateEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EpicUpdate }) =>
      updateEpic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.epics.root })
    },
  })
}
