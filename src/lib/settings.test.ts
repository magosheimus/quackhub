import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadSettings,
  saveSettings,
  isDarkCartucho,
  DEFAULT_SETTINGS,
} from './settings'

describe('settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadSettings sem nada salvo retorna os defaults', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('saveSettings mescla parcial com os defaults e persiste', () => {
    saveSettings({ cartucho: 'amber-dark', scanlines: true })
    const loaded = loadSettings()
    expect(loaded.cartucho).toBe('amber-dark')
    expect(loaded.scanlines).toBe(true)
    expect(loaded.texture).toBe(DEFAULT_SETTINGS.texture)
  })

  it('saveSettings sucessivo acumula as mudanças', () => {
    saveSettings({ cartucho: 'slate' })
    saveSettings({ glow: true })
    const loaded = loadSettings()
    expect(loaded.cartucho).toBe('slate')
    expect(loaded.glow).toBe(true)
  })

  it('isDarkCartucho identifica corretamente as variantes escuras', () => {
    expect(isDarkCartucho('sage-dark')).toBe(true)
    expect(isDarkCartucho('amber-dark')).toBe(true)
    expect(isDarkCartucho('sage')).toBe(false)
    expect(isDarkCartucho('amber')).toBe(false)
    expect(isDarkCartucho('slate')).toBe(false)
    expect(isDarkCartucho('earth')).toBe(false)
  })
})
