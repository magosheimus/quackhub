import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteChecklistItem } from '@/features/tasks/api/checklist'
import { queryKeys } from '@/shared/query/queryKeys'

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; taskId: string }) =>
      deleteChecklistItem(id),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.checklist.byTask(taskId),
      })
    },
  })
}
