import { useQuery } from '@tanstack/react-query'
import { getDependencies } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useDependencies(taskId: string) {
  return useQuery({
    queryKey: queryKeys.dependencies.byTask(taskId),
    queryFn: () => getDependencies(taskId),
  })
}
