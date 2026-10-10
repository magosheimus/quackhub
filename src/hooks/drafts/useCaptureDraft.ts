import { useMutation, useQueryClient } from '@tanstack/react-query'
import { captureItem } from '@/services/drafts/drafts'
import { queryKeys } from '@/lib/queryKeys'

export function useCaptureDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => captureItem(content),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drafts.root })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
