import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEpic } from '@/features/epics/api/epics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCreateEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEpic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.epics.root })
    },
  })
}
