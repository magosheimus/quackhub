import { useMutation, useQueryClient } from '@tanstack/react-query'
import { captureItem } from '@/features/drafts/api/drafts'
import { queryKeys } from '@/shared/query/queryKeys'

export function useCaptureDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => captureItem(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.root })
    },
  })
}
