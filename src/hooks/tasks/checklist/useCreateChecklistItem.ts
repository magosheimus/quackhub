import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createChecklistItem } from '@/services/tasks/checklist'

export function useCreateChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChecklistItem,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', item.task_id] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
