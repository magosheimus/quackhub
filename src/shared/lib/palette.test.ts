import { describe, expect, it } from 'vitest'
import { paletteVar, resolvePaletteColor, toPaletteColor } from './palette'

describe('palette', () => {
  it('aceita só chaves da paleta', () => {
    expect(toPaletteColor('sage')).toBe('sage')
    expect(toPaletteColor('#e3a857')).toBeNull()
    expect(toPaletteColor(null)).toBeNull()
  })

  it('a cor vira a variável do tema atual', () => {
    expect(paletteVar('rose')).toBe('var(--palette-rose)')
  })

  it('valor desconhecido usa o fallback', () => {
    expect(resolvePaletteColor('blue', 'x')).toBe('var(--palette-blue)')
    expect(resolvePaletteColor('#123456', 'var(--border-strong)')).toBe(
      'var(--border-strong)',
    )
  })
})
