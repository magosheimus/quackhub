import { useMutation, useQueryClient } from '@tanstack/react-query'
import { softDeleteEpic } from '@/services/epics/epics'

export function useSoftDeleteEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: softDeleteEpic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
