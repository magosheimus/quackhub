import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChecklistItem } from '@/features/tasks/api/checklist'
import { queryKeys } from '@/shared/query/queryKeys'
import type { ChecklistItemUpdate } from '@/shared/types/entities'

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
  })
}
