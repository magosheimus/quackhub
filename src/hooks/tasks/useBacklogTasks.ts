import { useQuery } from '@tanstack/react-query'
import { getBacklogTasks } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useBacklogTasks(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.tasks.backlog(projectId),
    queryFn: () => getBacklogTasks(projectId),
  })
}
