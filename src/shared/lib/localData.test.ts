import { beforeEach, describe, expect, it } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { clearQueryCache, clearUserLocalData } from './localData'

function seedStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.setItem(key, '1'))
}

function storedKeys() {
  return Object.values(STORAGE_KEYS).filter(
    (key) => localStorage.getItem(key) !== null,
  )
}

describe('dados locais', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    localStorage.clear()
    seedStorage()
    queryClient = new QueryClient()
    queryClient.setQueryData(['tasks'], [{ id: 't1' }])
  })

  it('limpar cache preserva fila offline, marcados e configurações', () => {
    clearQueryCache(queryClient)

    expect(queryClient.getQueryData(['tasks'])).toBeUndefined()
    expect(storedKeys()).toEqual([
      STORAGE_KEYS.settings,
      STORAGE_KEYS.draftsQueue,
      STORAGE_KEYS.draftsChecked,
    ])
  })

  it('logout apaga tudo do usuário e mantém só as configurações', () => {
    clearUserLocalData(queryClient)

    expect(queryClient.getQueryData(['tasks'])).toBeUndefined()
    expect(storedKeys()).toEqual([STORAGE_KEYS.settings])
  })
})
