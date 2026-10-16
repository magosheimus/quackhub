import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTaskLink,
  deleteTaskLink,
  getTaskLinks,
} from '@/features/tasks/api/links'
import { queryKeys } from '@/shared/query/queryKeys'

export function useTaskLinks(taskId: string) {
  return useQuery({
    queryKey: queryKeys.links.byTask(taskId),
    queryFn: () => getTaskLinks(taskId),
  })
}

export function useCreateTaskLink(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTaskLink,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.links.byTask(taskId),
      })
    },
  })
}

export function useDeleteTaskLink(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTaskLink,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.links.byTask(taskId),
      })
    },
  })
}
