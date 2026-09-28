import { useQuery } from '@tanstack/react-query'
import { getTagsByProject } from '@/services/tasks/tasks'

export function useProjectTags(projectId: string | null) {
  return useQuery({
    queryKey: ['tags', projectId],
    queryFn: () => getTagsByProject(projectId as string),
    enabled: Boolean(projectId),
  })
}
