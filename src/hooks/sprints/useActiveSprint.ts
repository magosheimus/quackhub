import { useQuery } from '@tanstack/react-query'
import { getActiveSprint } from '@/services/sprints/sprints'

export function useActiveSprint() {
  return useQuery({
    queryKey: ['sprints', 'active'],
    queryFn: getActiveSprint,
  })
}
