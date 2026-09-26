import { useQuery } from '@tanstack/react-query'
import { getActiveSprint } from '@/services/sprints/sprints'

export function useActiveSprint(projectId: string) {
  return useQuery({
    queryKey: ['sprints', projectId, 'active'],
    queryFn: () => getActiveSprint(projectId),
    enabled: !!projectId,
  })
}
