import { describe, expect, it } from 'vitest'
import { AUTH_ERRORS } from '@/features/auth/constants/texts'
import { getAuthErrorMessage, readOAuthError } from './authErrors'

describe('getAuthErrorMessage', () => {
  it('traduz os códigos conhecidos', () => {
    expect(getAuthErrorMessage('invalid_credentials')).toBe(
      AUTH_ERRORS.invalidCredentials,
    )
    expect(getAuthErrorMessage('signup_disabled')).toBe(
      AUTH_ERRORS.signupDisabled,
    )
  })

  it('usa a mensagem genérica para código desconhecido ou ausente', () => {
    expect(getAuthErrorMessage('weird_code')).toBe(AUTH_ERRORS.generic)
    expect(getAuthErrorMessage(undefined)).toBe(AUTH_ERRORS.generic)
  })
})

describe('readOAuthError', () => {
  it('lê o erro da query string (PKCE)', () => {
    expect(
      readOAuthError({
        search: '?error=access_denied&error_code=signup_disabled',
        hash: '',
      }),
    ).toBe(AUTH_ERRORS.signupDisabled)
  })

  it('lê o erro do hash (fluxo implícito)', () => {
    expect(readOAuthError({ search: '', hash: '#error=access_denied' })).toBe(
      AUTH_ERRORS.accessDenied,
    )
  })

  it('retorna null quando não há erro', () => {
    expect(readOAuthError({ search: '?code=abc', hash: '' })).toBeNull()
  })
})
