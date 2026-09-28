import { useQuery } from '@tanstack/react-query'
import { getTaskTags } from '@/services/tasks/tasks'

export function useTaskTags(taskId: string) {
  return useQuery({
    queryKey: ['tags', 'task', taskId],
    queryFn: () => getTaskTags(taskId),
  })
}
