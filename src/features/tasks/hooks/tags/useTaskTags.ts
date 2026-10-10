import { useQuery } from '@tanstack/react-query'
import { getTaskTags } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useTaskTags(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tags.byTask(taskId),
    queryFn: () => getTaskTags(taskId),
  })
}
