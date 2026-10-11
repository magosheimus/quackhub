import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createChecklistItem } from '@/features/tasks/api/checklist'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCreateChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChecklistItem,
    onSuccess: (item) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.checklist.byTask(item.task_id),
      })
    },
  })
}
