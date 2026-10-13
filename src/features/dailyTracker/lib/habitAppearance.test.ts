import { describe, expect, it } from 'vitest'
import {
  DEFAULT_HABIT_ICON,
  getHabitColor,
  getHabitIconKey,
  resolveHabitColor,
} from './habitAppearance'

describe('getHabitIconKey', () => {
  it('usa o ícone salvo quando é da curadoria', () => {
    expect(getHabitIconKey({ icon: 'book' })).toBe('book')
  })

  it('cai no ícone padrão quando é desconhecido ou não há hábito', () => {
    expect(getHabitIconKey({ icon: 'rocket' })).toBe(DEFAULT_HABIT_ICON)
    expect(getHabitIconKey()).toBe(DEFAULT_HABIT_ICON)
  })
})

describe('getHabitColor', () => {
  it('aceita só cores da paleta, senão usa a cor do tema', () => {
    expect(getHabitColor({ color: 'sage' })).toBe('sage')
    expect(getHabitColor({ color: '#e3a857' })).toBeNull()
    expect(getHabitColor({ color: null })).toBeNull()
  })
})

describe('resolveHabitColor', () => {
  it('sem cor escolhida segue o accent do tema', () => {
    expect(resolveHabitColor(null)).toBe('var(--accent)')
    expect(resolveHabitColor('sage')).toBe('var(--palette-sage)')
  })
})
