import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { ERROR_MESSAGES, reportError } from '@/shared/lib/errors'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      reportError(error, ERROR_MESSAGES.loadFailed)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      reportError(error)
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
