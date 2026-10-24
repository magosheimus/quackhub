import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDraftProject } from '@/features/drafts/api/drafts'
import {
  applyDraftArrangement,
  type DraftArrangement,
} from '@/features/drafts/lib/drafts'
import { savePositions } from '@/shared/api/positions'
import { queryKeys } from '@/shared/query/queryKeys'
import { invalidateDraftQueries } from '@/shared/query/queryInvalidation'
import type { DraftsItem } from '@/shared/types/entities'

async function saveArrangement({
  draftId,
  projectId,
  movesProject,
  orderedIds,
}: DraftArrangement): Promise<void> {
  if (movesProject) {
    await updateDraftProject(draftId, projectId)
  }
  await savePositions('drafts_items', orderedIds)
}

export function useArrangeDrafts() {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.drafts.root

  return useMutation({
    mutationFn: saveArrangement,

    onMutate: async (arrangement) => {
      await queryClient.cancelQueries({ queryKey })
      const previousItems = queryClient.getQueryData<DraftsItem[]>(queryKey)
      queryClient.setQueryData<DraftsItem[]>(queryKey, (items) =>
        items ? applyDraftArrangement(items, arrangement) : items,
      )
      return { previousItems }
    },

    onError: (_error, _arrangement, context) => {
      queryClient.setQueryData(queryKey, context?.previousItems)
    },

    onSettled: () => {
      invalidateDraftQueries(queryClient)
    },
  })
}
