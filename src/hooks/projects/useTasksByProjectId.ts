import { useQuery } from '@tanstack/react-query'
import { getTasksByProjectId } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useTasksByProjectId(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.tasks.project(projectId),
    queryFn: () => getTasksByProjectId(projectId ?? ''),
    enabled: !!projectId,
  })
}
