import { useQuery } from '@tanstack/react-query'
import { getBacklogTasks } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useBacklogTasks(projectId?: string | null) {
  return useQuery({
    queryKey: queryKeys.tasks.backlog(projectId),
    queryFn: () => getBacklogTasks(projectId),
  })
}
