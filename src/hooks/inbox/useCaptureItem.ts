import { useMutation, useQueryClient } from '@tanstack/react-query'
import { captureItem } from '@/services/inbox/inbox'

export function useCaptureItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => captureItem(content),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
}
