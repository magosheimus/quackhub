import { describe, expect, it } from 'vitest'
import { DEFAULT_HABIT_ICON, getHabitIconKey } from './habitAppearance'

describe('getHabitIconKey', () => {
  it('usa o ícone salvo quando é da curadoria', () => {
    expect(getHabitIconKey({ icon: 'book' })).toBe('book')
  })

  it('cai no ícone padrão quando é desconhecido ou não há hábito', () => {
    expect(getHabitIconKey({ icon: 'rocket' })).toBe(DEFAULT_HABIT_ICON)
    expect(getHabitIconKey()).toBe(DEFAULT_HABIT_ICON)
  })
})
