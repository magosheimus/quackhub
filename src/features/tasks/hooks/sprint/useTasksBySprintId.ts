import { useQuery } from '@tanstack/react-query'
import { getTasksBySprintId } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useTasksBySprintId(sprintId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.sprint(sprintId),
    queryFn: () => getTasksBySprintId(sprintId),
    enabled: !!sprintId,
  })
}
