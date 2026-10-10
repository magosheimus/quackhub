import { useQuery } from '@tanstack/react-query'
import { getTaskById } from '@/features/tasks/api/tasks'
import { queryKeys } from '@/shared/query/queryKeys'

export function useTaskById(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
  })
}
