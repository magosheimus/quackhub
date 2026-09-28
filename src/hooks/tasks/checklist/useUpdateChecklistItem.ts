import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChecklistItem } from '@/services/tasks/checklist'
import type { Database } from '@/types/database.types'

type ChecklistItemUpdate =
  Database['public']['Tables']['task_checklist_items']['Update']

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChecklistItemUpdate }) =>
      updateChecklistItem(id, data),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', item.task_id] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
