import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/services/projects'

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    })
}