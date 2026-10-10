import { useQuery } from '@tanstack/react-query'
import { getTasksByProjectId } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useTasksByProjectId(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.tasks.project(projectId),
    queryFn: () => getTasksByProjectId(projectId ?? ''),
    enabled: !!projectId,
  })
}
