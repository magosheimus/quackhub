import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteEpic } from '@/services/epics/epics'
import { queryKeys } from '@/lib/queryKeys'

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
