import { useQuery } from '@tanstack/react-query'
import { getSprints } from '@/services/sprints/sprints'

export function useSprints() {
  return useQuery({
    queryKey: ['sprints'],
    queryFn: getSprints,
  })
}
