import { describe, expect, it } from 'vitest'
import { nextImportance, toImportance } from './importance'

describe('importância', () => {
  it('aceita só de 1 a 5', () => {
    expect(toImportance(3)).toBe(3)
    expect(toImportance(0)).toBeNull()
    expect(toImportance(6)).toBeNull()
    expect(toImportance(null)).toBeNull()
  })

  it('clicar na mesma estrela limpa a nota', () => {
    expect(nextImportance(null, 4)).toBe(4)
    expect(nextImportance(2, 4)).toBe(4)
    expect(nextImportance(4, 4)).toBeNull()
  })
})
