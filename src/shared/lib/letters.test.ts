import { describe, expect, it } from 'vitest'
import { getInitialLetter } from './letters'

describe('getInitialLetter', () => {
  it('usa a primeira letra em minúscula', () => {
    expect(getInitialLetter('  Shimi')).toBe('s')
  })

  it('remove acento e cedilha', () => {
    expect(getInitialLetter('Ágata')).toBe('a')
    expect(getInitialLetter('Çaba')).toBe('c')
  })

  it('retorna null sem letra inicial', () => {
    expect(getInitialLetter('42 loja')).toBeNull()
    expect(getInitialLetter('')).toBeNull()
  })
})
