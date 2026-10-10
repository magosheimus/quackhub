import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEpic } from '@/services/epics/epics'
import { queryKeys } from '@/lib/queryKeys'

export function useCreateEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEpic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.epics.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
