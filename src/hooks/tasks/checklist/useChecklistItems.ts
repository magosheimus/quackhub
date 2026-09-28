import { useQuery } from '@tanstack/react-query'
import { getChecklistItems } from '@/services/tasks/checklist'

export function useChecklistItems(taskId: string) {
  return useQuery({
    queryKey: ['checklist', taskId],
    queryFn: () => getChecklistItems(taskId),
  })
}
