import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { savePositions } from '@/shared/api/positions'
import { queryKeys } from '@/shared/query/queryKeys'
import { applyTaskOrder } from '@/features/tasks/lib/taskOrder'
import type { Task } from '@/features/tasks/model/task'

export function useReorderTasks(queryKey: QueryKey) {
  const queryClient = useQueryClient()

  const { mutate: reorder } = useMutation({
    mutationFn: (orderedIds: string[]) => savePositions('tasks', orderedIds),

    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey)
      queryClient.setQueryData<Task[]>(
        queryKey,
        (tasks) => tasks && applyTaskOrder(tasks, orderedIds),
      )
      return { previousTasks }
    },

    onError: (_error, _orderedIds, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.root })
    },
  })

  return { reorder }
}
