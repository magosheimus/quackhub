import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChecklistItem } from '@/services/tasks/checklist'
import { queryKeys } from '@/lib/queryKeys'
import type { ChecklistItemUpdate } from '@/types/entities'

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChecklistItemUpdate }) =>
      updateChecklistItem(id, data),
    onSuccess: (item) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.checklist.byTask(item.task_id),
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
