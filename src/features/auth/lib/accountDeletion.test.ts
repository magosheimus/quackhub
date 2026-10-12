import { describe, expect, it } from 'vitest'
import { isDeletionConfirmed } from './accountDeletion'

describe('isDeletionConfirmed', () => {
  it('confirma com o e-mail da conta, ignorando maiúsculas e espaços', () => {
    expect(isDeletionConfirmed('  Eu@Exemplo.com ', 'eu@exemplo.com')).toBe(
      true,
    )
  })

  it('não confirma com outro e-mail', () => {
    expect(isDeletionConfirmed('outro@exemplo.com', 'eu@exemplo.com')).toBe(
      false,
    )
  })

  it('não confirma sem e-mail da conta', () => {
    expect(isDeletionConfirmed('', '')).toBe(false)
  })
})
