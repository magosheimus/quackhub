import { describe, it, expect } from 'vitest'
import { startOfWeek, groupQualityByWeek } from './analytics'

describe('startOfWeek', () => {
  it('retorna o domingo da semana (2026-09-30 é quarta)', () => {
    expect(startOfWeek('2026-09-30')).toBe('2026-09-27')
  })

  it('uma data que já é domingo retorna ela mesma', () => {
    expect(startOfWeek('2026-09-27')).toBe('2026-09-27')
  })
})

describe('groupQualityByWeek', () => {
  it('agrupa e tira a média por semana', () => {
    const result = groupQualityByWeek([
      { session_date: '2026-09-28', quality: 4 },
      { session_date: '2026-09-30', quality: 2 },
      { session_date: '2026-10-05', quality: 5 },
    ])
    expect(result).toEqual([
      { week: '2026-09-27', averageQuality: 3 },
      { week: '2026-10-04', averageQuality: 5 },
    ])
  })

  it('ignora entradas sem quality (comentário manual)', () => {
    const result = groupQualityByWeek([
      { session_date: '2026-09-28', quality: 4 },
      { session_date: '2026-09-28', quality: null },
    ])
    expect(result).toEqual([{ week: '2026-09-27', averageQuality: 4 }])
  })

  it('sem entradas retorna array vazio', () => {
    expect(groupQualityByWeek([])).toEqual([])
  })
})
