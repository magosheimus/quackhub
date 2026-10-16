import { describe, expect, it } from 'vitest'
import { pixelRowsToPath } from './pixelIcon'

describe('pixelRowsToPath', () => {
  it('vira um retângulo por sequência de pixels em cada linha', () => {
    expect(pixelRowsToPath(['.##.', '#..#'])).toBe(
      'M1 0h2v1h-2zM0 1h1v1h-1zM3 1h1v1h-1z',
    )
  })

  it('linha vazia não gera nada', () => {
    expect(pixelRowsToPath(['....'])).toBe('')
  })
})
