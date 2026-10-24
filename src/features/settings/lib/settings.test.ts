import { describe, it, expect, beforeEach } from 'vitest'
import {
  applySettings,
  loadSettings,
  saveSettings,
  isDarkCartucho,
  DEFAULT_SETTINGS,
  getTextureOpacity,
  isDateFormat,
  isFontBody,
  textureOpacityUpdate,
  normalizeSettings,
  getDefaultAppearance,
  getEffectiveLcdGhost,
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

describe('guards das preferências', () => {
  it('valida fonte e formato de data', () => {
    expect(isFontBody('ibm-plex')).toBe(true)
    expect(isFontBody('comic-sans')).toBe(false)
    expect(isDateFormat('MM/dd/yyyy')).toBe(true)
    expect(isDateFormat('yyyy-MM-dd')).toBe(false)
  })
})

describe('opacidade da textura', () => {
  it('cada textura tem a sua intensidade', () => {
    const dots = { ...DEFAULT_SETTINGS, texture: 'dots' as const }
    const lcd = { ...DEFAULT_SETTINGS, texture: 'lcd' as const }

    expect(getTextureOpacity(dots)).toBe(DEFAULT_SETTINGS.textureOpacity.dots)
    expect(getTextureOpacity(lcd)).toBe(DEFAULT_SETTINGS.textureOpacity.lcd)
    expect(textureOpacityUpdate(lcd, 30).textureOpacity).toEqual({
      ...DEFAULT_SETTINGS.textureOpacity,
      lcd: 30,
    })
  })

  it('sem textura não tem intensidade', () => {
    const none = { ...DEFAULT_SETTINGS, texture: 'none' as const }
    expect(getTextureOpacity(none)).toBe(0)
    expect(textureOpacityUpdate(none, 30)).toEqual({})
  })
})

describe('applySettings', () => {
  it('marca os cartuchos escuros com theme-dark', () => {
    applySettings({ ...DEFAULT_SETTINGS, cartucho: 'amber-dark' })
    expect(document.documentElement).toHaveClass(
      'cartucho-amber-dark',
      'theme-dark',
    )

    applySettings({ ...DEFAULT_SETTINGS, cartucho: 'amber' })
    expect(document.documentElement).not.toHaveClass('theme-dark')
  })

  it('liga glow e scanlines só pelos toggles', () => {
    applySettings({ ...DEFAULT_SETTINGS, cartucho: 'sage-dark' })
    expect(document.documentElement).not.toHaveClass('glow-on', 'scanlines-on')

    applySettings({ ...DEFAULT_SETTINGS, glow: true, scanlines: true })
    expect(document.documentElement).toHaveClass('glow-on', 'scanlines-on')
  })

  it('efeito LCD só aplica classe com o glow ligado', () => {
    applySettings({ ...DEFAULT_SETTINGS, lcdGhost: 'glitch' })
    expect(document.documentElement).not.toHaveClass('lcd-glitch')

    applySettings({ ...DEFAULT_SETTINGS, glow: true, lcdGhost: 'glitch' })
    expect(document.documentElement).toHaveClass('glow-on', 'lcd-glitch')
  })
})

describe('normalizeSettings', () => {
  it('retorna os defaults para valor que não é objeto', () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS)
    expect(normalizeSettings('sage')).toEqual(DEFAULT_SETTINGS)
  })

  it('mantém campos válidos e troca os inválidos pelo padrão', () => {
    const result = normalizeSettings({
      cartucho: 'sage-dark',
      glow: true,
      texture: 'neon',
      gridOpacity: 150,
      scanlines: 'sim',
      lcdGhost: 'neon',
    })
    expect(result.cartucho).toBe('sage-dark')
    expect(result.glow).toBe(true)
    expect(result.texture).toBe(DEFAULT_SETTINGS.texture)
    expect(result.textureOpacity).toEqual(DEFAULT_SETTINGS.textureOpacity)
    expect(result.scanlines).toBe(DEFAULT_SETTINGS.scanlines)
    expect(result.lcdGhost).toBe(DEFAULT_SETTINGS.lcdGhost)
  })

  it('tamanho do texto desconhecido volta ao normal', () => {
    expect(normalizeSettings({ textSize: 'large' }).textSize).toBe('large')
    expect(normalizeSettings({ textSize: 'gigante' }).textSize).toBe('normal')
  })

  it('aproveita a intensidade salva no formato antigo', () => {
    const result = normalizeSettings({ gridOpacity: 20, dotsOpacity: 90 })
    expect(result.textureOpacity.grid).toBe(20)
    expect(result.textureOpacity.dots).toBe(90)
    expect(result.textureOpacity.lines).toBe(
      DEFAULT_SETTINGS.textureOpacity.lines,
    )
  })
})

describe('sidebarCollapsed', () => {
  it('começa expandida e só aceita booleano', () => {
    expect(DEFAULT_SETTINGS.sidebarCollapsed).toBe(false)
    expect(normalizeSettings({ sidebarCollapsed: true }).sidebarCollapsed).toBe(
      true,
    )
    expect(
      normalizeSettings({ sidebarCollapsed: 'sim' }).sidebarCollapsed,
    ).toBe(false)
  })
})

describe('getDefaultAppearance', () => {
  it('volta a aparência ao padrão sem mexer nas preferências', () => {
    const defaults = getDefaultAppearance()
    expect(defaults.cartucho).toBe(DEFAULT_SETTINGS.cartucho)
    expect(defaults.textureOpacity).toEqual(DEFAULT_SETTINGS.textureOpacity)
    expect(defaults).not.toHaveProperty('dateFormat')
    expect(defaults).not.toHaveProperty('weekStartsOn')
    expect(defaults).not.toHaveProperty('sidebarCollapsed')
  })
})

describe('getEffectiveLcdGhost', () => {
  it('usa a preferência quando o glow está ligado', () => {
    expect(
      getEffectiveLcdGhost({
        ...DEFAULT_SETTINGS,
        glow: true,
        lcdGhost: 'glitch',
      }),
    ).toBe('glitch')
  })

  it('fica desligado com o glow desligado, sem perder a preferência', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      glow: false,
      lcdGhost: 'glitch' as const,
    }
    expect(getEffectiveLcdGhost(settings)).toBe('off')
    expect(settings.lcdGhost).toBe('glitch')
  })
})
