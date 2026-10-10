import { useQuery } from '@tanstack/react-query'
import { getChecklistItems } from '@/services/tasks/checklist'
import { queryKeys } from '@/lib/queryKeys'

export function useChecklistItems(taskId: string) {
  return useQuery({
    queryKey: queryKeys.checklist.byTask(taskId),
    queryFn: () => getChecklistItems(taskId),
  })
}
