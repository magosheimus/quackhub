import { useQuery } from '@tanstack/react-query'
import { getSprintsByProject } from '@/services/sprints/sprints'

export function useSprintsByProject(projectId: string) {
  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: () => getSprintsByProject(projectId),
    enabled: !!projectId,
  })
}
