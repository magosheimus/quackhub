import { useQuery } from '@tanstack/react-query'
import { getChecklistItems } from '@/features/tasks/api/checklist'
import { queryKeys } from '@/shared/query/queryKeys'

export function useChecklistItems(taskId: string) {
  return useQuery({
    queryKey: queryKeys.checklist.byTask(taskId),
    queryFn: () => getChecklistItems(taskId),
  })
}
