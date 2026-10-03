import { MutationCache, QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { showErrorToast } from './toast'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.silent) {
        return
      }
      showErrorToast(
        navigator.onLine
          ? 'Algo deu errado. Tente novamente.'
          : 'Sem conexão. A operação não foi concluída.',
      )
    },
  }),
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
    },
    mutations: {
      networkMode: 'always',
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'quackhub-query-cache',
})

persistQueryClient({ queryClient, persister, maxAge: 1000 * 60 * 60 * 24 })
