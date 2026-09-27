import { useQuery } from '@tanstack/react-query'
import { getBacklogTasks } from '@/services/tasks/tasks'

export function useBacklogTasks(projectId?: string | null) {
  return useQuery({
    queryKey: ['tasks', 'backlog', projectId ?? 'all'],
    queryFn: () => getBacklogTasks(projectId),
  })
}
