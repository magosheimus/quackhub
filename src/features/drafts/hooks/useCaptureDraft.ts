import { useMutation, useQueryClient } from '@tanstack/react-query'
import { captureItem } from '@/features/drafts/api/drafts'
import { invalidateDraftQueries } from '@/shared/query/queryInvalidation'

export function useCaptureDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => captureItem(content),
    onSuccess: () => {
      invalidateDraftQueries(queryClient)
    },
  })
}
