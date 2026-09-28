import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteChecklistItem } from '@/services/tasks/checklist'

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; taskId: string }) =>
      deleteChecklistItem(id),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', taskId] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
