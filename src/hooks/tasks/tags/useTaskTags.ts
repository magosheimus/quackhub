import { useQuery } from '@tanstack/react-query'
import { getTaskTags } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useTaskTags(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tags.byTask(taskId),
    queryFn: () => getTaskTags(taskId),
  })
}
