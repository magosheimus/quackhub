import { describe, expect, it } from 'vitest'
import { getPasswordIssue } from './password'

describe('getPasswordIssue', () => {
  it('aceita senha com 8+ caracteres, letras e números, igual à confirmação', () => {
    expect(getPasswordIssue('pato1234', 'pato1234')).toBeNull()
  })

  it('recusa senha curta', () => {
    expect(getPasswordIssue('pato12', 'pato12')).toBe('tooShort')
  })

  it('recusa senha sem letras ou sem números', () => {
    expect(getPasswordIssue('12345678', '12345678')).toBe('needsLetterAndDigit')
    expect(getPasswordIssue('patopato', 'patopato')).toBe('needsLetterAndDigit')
  })

  it('recusa confirmação diferente', () => {
    expect(getPasswordIssue('pato1234', 'pato12345')).toBe('mismatch')
  })
})
