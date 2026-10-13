import type { DropResult } from '@hello-pangea/dnd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveItem } from '@/shared/lib/array'
import { reorderEpics } from '@/features/epics/api/epics'
import { queryKeys } from '@/shared/query/queryKeys'
import type { Epic } from '@/shared/types/entities'

export function useReorderEpics(projectId: string, epics: Epic[]) {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.epics.byProject(projectId)

  const { mutate: reorder } = useMutation({
    mutationFn: (orderedEpics: Epic[]) =>
      reorderEpics(orderedEpics.map((epic) => epic.id)),

    onMutate: async (orderedEpics) => {
      await queryClient.cancelQueries({ queryKey })
      const previousEpics = queryClient.getQueryData<Epic[]>(queryKey)
      queryClient.setQueryData<Epic[]>(queryKey, orderedEpics)
      return { previousEpics }
    },

    onError: (_error, _orderedEpics, context) => {
      queryClient.setQueryData(queryKey, context?.previousEpics)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.epics.root })
    },
  })

  function handleDragEnd({ source, destination }: DropResult) {
    if (!destination || destination.index === source.index) {
      return
    }
    reorder(moveItem(epics, source.index, destination.index))
  }

  return { handleDragEnd }
}
