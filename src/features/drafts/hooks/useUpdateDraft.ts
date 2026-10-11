import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDraftContent } from '@/features/drafts/api/drafts'
import { queryKeys } from '@/shared/query/queryKeys'

export function useUpdateDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateDraftContent(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.root })
    },
  })
}
