import { afterEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { loadUiScale, saveUiScale, toScaleFactor } from './uiScale'

describe('escala da interface', () => {
  afterEach(() => localStorage.clear())

  it('sem nada salvo, ou com valor inválido, usa 100%', () => {
    expect(loadUiScale()).toBe('100')
    localStorage.setItem(STORAGE_KEYS.uiScale, '75')
    expect(loadUiScale()).toBe('100')
  })

  it('lê a escala salva neste aparelho', () => {
    saveUiScale('90')
    expect(loadUiScale()).toBe('90')
  })

  it('converte para o fator da fonte base', () => {
    expect(toScaleFactor('80')).toBe(0.8)
    expect(toScaleFactor('120')).toBe(1.2)
  })
})
