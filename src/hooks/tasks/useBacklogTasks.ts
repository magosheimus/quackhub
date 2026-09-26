import { useQuery } from '@tanstack/react-query'
import { getBacklogTasks } from '@/services/tasks/tasks'

export function useBacklogTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', 'backlog', projectId],
    queryFn: () => getBacklogTasks(projectId),
    enabled: !!projectId,
  })
}
