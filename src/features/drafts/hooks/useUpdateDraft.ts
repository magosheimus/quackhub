import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDraftContent } from '@/features/drafts/api/drafts'
import { invalidateDraftQueries } from '@/shared/query/queryInvalidation'

export function useUpdateDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateDraftContent(id, content),
    onSuccess: () => {
      invalidateDraftQueries(queryClient)
    },
  })
}
