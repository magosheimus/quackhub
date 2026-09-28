import { useQuery } from '@tanstack/react-query'
import { getTaskById } from '@/services/tasks/tasks'

export function useTaskById(id: string) {
  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  })
}
