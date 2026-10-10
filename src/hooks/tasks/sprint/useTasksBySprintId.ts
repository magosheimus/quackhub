import { useQuery } from '@tanstack/react-query'
import { getTasksBySprintId } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useTasksBySprintId(sprintId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.sprint(sprintId),
    queryFn: () => getTasksBySprintId(sprintId),
    enabled: !!sprintId,
  })
}
