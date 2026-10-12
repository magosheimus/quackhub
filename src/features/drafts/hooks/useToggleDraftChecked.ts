import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setDraftChecked } from '@/features/drafts/api/drafts'
import { queryKeys } from '@/shared/query/queryKeys'
import type { DraftsItem } from '@/shared/types/entities'

type ToggleVars = {
  id: string
  checked: boolean
}

export function useToggleDraftChecked() {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.drafts.root

  return useMutation({
    mutationFn: ({ id, checked }: ToggleVars) => setDraftChecked(id, checked),

    onMutate: async ({ id, checked }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousItems = queryClient.getQueryData<DraftsItem[]>(queryKey)
      queryClient.setQueryData<DraftsItem[]>(queryKey, (items) =>
        items?.map((item) =>
          item.id === id
            ? { ...item, checked_at: checked ? new Date().toISOString() : null }
            : item,
        ),
      )
      return { previousItems }
    },

    onError: (_error, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previousItems)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
