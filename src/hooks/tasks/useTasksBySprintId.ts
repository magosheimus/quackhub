import { useQuery } from '@tanstack/react-query'
import { getTasksBySprintId } from '@/services/tasks/tasks'

export function useTasksBySprintId(sprintId: string) {
  return useQuery({
    queryKey: ['tasks', 'sprint', sprintId],
    queryFn: () => getTasksBySprintId(sprintId),
    enabled: !!sprintId,
  })
}
