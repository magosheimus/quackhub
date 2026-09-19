import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEpic } from '@/services/epics/epics'

export function useCreateEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEpic,
    onSuccess: (epic) => {
      queryClient.invalidateQueries({ queryKey: ['epics', epic.project_id] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
