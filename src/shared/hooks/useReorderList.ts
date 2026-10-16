import type { DropResult } from '@hello-pangea/dnd'
import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { moveItem } from '@/shared/lib/array'
import { savePositions, type PositionedTable } from '@/shared/api/positions'

type ReorderListOptions<T> = {
  table: PositionedTable
  items: T[]
  queryKey: QueryKey
  invalidateKey?: QueryKey
}

export function useReorderList<T extends { id: string }>({
  table,
  items,
  queryKey,
  invalidateKey = queryKey,
}: ReorderListOptions<T>) {
  const queryClient = useQueryClient()

  const { mutate: reorder } = useMutation({
    mutationFn: (orderedItems: T[]) =>
      savePositions(
        table,
        orderedItems.map((item) => item.id),
      ),

    onMutate: async (orderedItems) => {
      await queryClient.cancelQueries({ queryKey })
      const previousItems = queryClient.getQueryData<T[]>(queryKey)
      queryClient.setQueryData<T[]>(queryKey, orderedItems)
      return { previousItems }
    },

    onError: (_error, _orderedItems, context) => {
      queryClient.setQueryData(queryKey, context?.previousItems)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey })
    },
  })

  function handleDragEnd({ source, destination }: DropResult) {
    if (!destination || destination.index === source.index) {
      return
    }
    reorder(moveItem(items, source.index, destination.index))
  }

  return { handleDragEnd }
}
