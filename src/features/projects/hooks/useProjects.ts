import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/features/projects/api/projects'
import { queryKeys } from '@/shared/query/queryKeys'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.root,
    queryFn: getProjects,
  })
}
