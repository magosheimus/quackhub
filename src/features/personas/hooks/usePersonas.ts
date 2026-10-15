import { useQuery } from '@tanstack/react-query'
import { getPersonas } from '@/features/personas/api/personas'
import { queryKeys } from '@/shared/query/queryKeys'

export function usePersonas() {
  return useQuery({
    queryKey: queryKeys.personas.root,
    queryFn: getPersonas,
  })
}
