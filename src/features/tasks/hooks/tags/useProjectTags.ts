import { useQuery } from '@tanstack/react-query'
import { getTagsByProject } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useProjectTags(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.tags.byProject(projectId),
    queryFn: () => getTagsByProject(projectId as string),
    enabled: Boolean(projectId),
  })
}
