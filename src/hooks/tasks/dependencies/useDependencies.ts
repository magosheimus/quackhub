import { useQuery } from '@tanstack/react-query'
import { getDependencies } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useDependencies(taskId: string) {
  return useQuery({
    queryKey: queryKeys.dependencies.byTask(taskId),
    queryFn: () => getDependencies(taskId),
  })
}
