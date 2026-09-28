import { useQuery } from '@tanstack/react-query'
import { getDependencies } from '@/services/tasks/tasks'

export function useDependencies(taskId: string) {
  return useQuery({
    queryKey: ['dependencies', taskId],
    queryFn: () => getDependencies(taskId),
  })
}
