import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteEpic } from '@/features/epics/api/epics'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSoftDeleteEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: softDeleteEpic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.epics.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
