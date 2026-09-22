import { useQuery } from '@tanstack/react-query'
import { getTasksByProject } from '@/services/tasks/tasks'

export function useBoardTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  })
}
