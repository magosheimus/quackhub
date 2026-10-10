import { useQuery } from '@tanstack/react-query'
import { getTagsByProject } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useProjectTags(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.tags.byProject(projectId),
    queryFn: () => getTagsByProject(projectId as string),
    enabled: Boolean(projectId),
  })
}
