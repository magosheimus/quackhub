import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { ERROR_MESSAGES, reportError } from '@/shared/lib/errors'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

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
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 60 * 24,
    },
    mutations: {
      networkMode: 'always',
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: STORAGE_KEYS.queryCache,
})

// Subir ao mudar o formato de algum dado em cache: o cache salvo com outra versão é descartado
const QUERY_CACHE_VERSION = '2'

persistQueryClient({
  queryClient,
  persister,
  buster: QUERY_CACHE_VERSION,
  maxAge: 1000 * 60 * 60 * 24,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      defaultShouldDehydrateQuery(query) && query.meta?.persist !== false,
  },
})
