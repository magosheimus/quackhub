import { describe, expect, it, vi } from 'vitest'
import { hasLoadError, retryFailedQueries } from './queryState'

function makeQuery(isError: boolean, data: unknown) {
  return { isError, data, refetch: vi.fn(() => Promise.resolve()) }
}

describe('hasLoadError', () => {
  it('acusa erro só quando a consulta falhou e não há dados para mostrar', () => {
    expect(hasLoadError(makeQuery(true, undefined))).toBe(true)
    expect(hasLoadError(makeQuery(true, []))).toBe(false)
    expect(hasLoadError(makeQuery(false, undefined))).toBe(false)
  })

  it('basta uma consulta falhar', () => {
    expect(hasLoadError(makeQuery(false, []), makeQuery(true, undefined))).toBe(
      true,
    )
  })
})

describe('retryFailedQueries', () => {
  it('refaz só as consultas que falharam', () => {
    const failed = makeQuery(true, undefined)
    const ok = makeQuery(false, [])
    retryFailedQueries(failed, ok)
    expect(failed.refetch).toHaveBeenCalledTimes(1)
    expect(ok.refetch).not.toHaveBeenCalled()
  })
})
