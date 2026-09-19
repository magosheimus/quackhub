import { useQuery } from '@tanstack/react-query'
import { getEpicsByProject } from '@/services/epics/epics'

export function useEpics(projectId: string) {
  return useQuery({
    queryKey: ['epics', projectId],
    queryFn: () => getEpicsByProject(projectId),
    enabled: !!projectId,
  })
}
