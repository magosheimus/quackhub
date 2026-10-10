import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/services/projects/projects'
import { queryKeys } from '@/lib/queryKeys'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.root,
    queryFn: getProjects,
  })
}
