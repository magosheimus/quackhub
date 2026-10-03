import { useQuery } from '@tanstack/react-query'
import { getTasksByProjectId } from '@/services/tasks/tasks'

export function useTasksByProjectId(projectId: string | null) {
  return useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => getTasksByProjectId(projectId ?? ''),
    enabled: !!projectId,
  })
}
