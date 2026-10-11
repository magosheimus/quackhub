import type { QueryClient } from '@tanstack/react-query'
import { STORAGE_KEYS, USER_DATA_KEYS } from '@/shared/constants/storageKeys'

function removeItems(keys: readonly string[]) {
  try {
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // localStorage indisponível (ex.: modo privado restrito): nada a limpar
  }
}

// "Limpar cache" em Configurações: só os dados em cache do servidor.
// Preserva a fila offline, que pode ter rascunhos ainda não sincronizados.
export function clearQueryCache(queryClient: QueryClient): void {
  queryClient.clear()
  removeItems([STORAGE_KEYS.queryCache])
}

// Logout / sessão expirada: tudo que pertence ao usuário
export function clearUserLocalData(queryClient: QueryClient): void {
  queryClient.clear()
  removeItems(USER_DATA_KEYS)
}
