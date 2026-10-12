import { describe, expect, it } from 'vitest'
import { readEmailLink } from './emailLink'

describe('readEmailLink', () => {
  it('lê o link de convite', () => {
    expect(readEmailLink('?token_hash=abc&type=invite')).toEqual({
      tokenHash: 'abc',
      type: 'invite',
    })
  })

  it('lê o link de recuperação de senha', () => {
    expect(readEmailLink('?token_hash=abc&type=recovery')?.type).toBe(
      'recovery',
    )
  })

  it('recusa link sem token ou com tipo desconhecido', () => {
    expect(readEmailLink('?type=invite')).toBeNull()
    expect(readEmailLink('?token_hash=abc&type=signup')).toBeNull()
    expect(readEmailLink('')).toBeNull()
  })
})
