import { useQuery } from '@tanstack/react-query'
import { getTaskById } from '@/services/tasks/tasks'
import { queryKeys } from '@/lib/queryKeys'

export function useTaskById(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
  })
}
