import { afterEach, describe, expect, it, vi } from 'vitest'
import { ERROR_MESSAGES, UserFacingError, getErrorMessage } from './errors'

function mockOnline(isOnline: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(isOnline)
}

describe('getErrorMessage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mostra a mensagem de regra de negócio como está', () => {
    mockOnline(true)
    expect(getErrorMessage(new UserFacingError('Sprint já ativa'))).toBe(
      'Sprint já ativa',
    )
  })

  it('esconde detalhes técnicos atrás da mensagem genérica', () => {
    mockOnline(true)
    expect(getErrorMessage(new Error('duplicate key value'))).toBe(
      ERROR_MESSAGES.generic,
    )
  })

  it('usa a mensagem de fallback quando informada', () => {
    mockOnline(true)
    expect(getErrorMessage(new Error('x'), 'Falha ao exportar')).toBe(
      'Falha ao exportar',
    )
  })

  it('avisa quando está sem conexão', () => {
    mockOnline(false)
    expect(getErrorMessage(new Error('fetch failed'))).toBe(
      ERROR_MESSAGES.offline,
    )
  })

  it('regra de negócio vence o aviso de conexão', () => {
    mockOnline(false)
    expect(getErrorMessage(new UserFacingError('Dependência pendente'))).toBe(
      'Dependência pendente',
    )
  })
})
