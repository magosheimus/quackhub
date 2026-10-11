import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadSettings,
  saveSettings,
  isDarkCartucho,
  DEFAULT_SETTINGS,
  getTextureOpacity,
  isDateFormat,
  isFontBody,
  parseWeekStart,
  textureOpacityUpdate,
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

describe('valores de Select', () => {
  it('valida fonte e formato de data', () => {
    expect(isFontBody('ibm-plex')).toBe(true)
    expect(isFontBody('comic-sans')).toBe(false)
    expect(isDateFormat('MM/dd/yyyy')).toBe(true)
    expect(isDateFormat('yyyy-MM-dd')).toBe(false)
  })

  it('converte o primeiro dia da semana', () => {
    expect(parseWeekStart('0')).toBe(0)
    expect(parseWeekStart('1')).toBe(1)
    expect(parseWeekStart('2')).toBeNull()
  })
})

describe('opacidade da textura', () => {
  it('usa a opacidade da textura ativa', () => {
    const dots = { ...DEFAULT_SETTINGS, texture: 'dots' as const }
    const grid = { ...DEFAULT_SETTINGS, texture: 'grid' as const }

    expect(getTextureOpacity(dots)).toBe(DEFAULT_SETTINGS.dotsOpacity)
    expect(getTextureOpacity(grid)).toBe(DEFAULT_SETTINGS.gridOpacity)
    expect(textureOpacityUpdate(dots, 30)).toEqual({ dotsOpacity: 30 })
    expect(textureOpacityUpdate(grid, 30)).toEqual({ gridOpacity: 30 })
  })
})
