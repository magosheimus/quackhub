import { describe, it, expect } from 'vitest'
import {
  ALL_SCOPE,
  CURRENT_SCOPE,
  countTasksByStatus,
  getAccuracyPercent,
  groupQualityByWeek,
  resolveLiveSprintId,
  startOfWeek,
  sumCounts,
  toAccuracyChartData,
} from './analytics'
import { makeTask } from '@/test/factories'

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

describe('resolveLiveSprintId', () => {
  it('usa a sprint ativa no escopo atual', () => {
    expect(resolveLiveSprintId(CURRENT_SCOPE, 's1')).toBe('s1')
    expect(resolveLiveSprintId(CURRENT_SCOPE, null)).toBeNull()
  })

  it('não filtra por sprint no escopo geral', () => {
    expect(resolveLiveSprintId(ALL_SCOPE, 's1')).toBeNull()
  })

  it('usa a sprint escolhida nos demais casos', () => {
    expect(resolveLiveSprintId('s9', 's1')).toBe('s9')
  })
})

describe('getAccuracyPercent', () => {
  it('converte a qualidade média (0–5) em porcentagem', () => {
    const weeks = [
      { week: '2026-01-04', averageQuality: 4 },
      { week: '2026-01-11', averageQuality: 3 },
    ]
    expect(getAccuracyPercent(weeks)).toBe(70)
  })

  it('é zero sem semanas', () => {
    expect(getAccuracyPercent([])).toBe(0)
  })
})

describe('toAccuracyChartData', () => {
  it('arredonda a qualidade em duas casas', () => {
    expect(
      toAccuracyChartData([{ week: '2026-01-04', averageQuality: 3.14159 }]),
    ).toEqual([{ week: '2026-01-04', quality: 3.14 }])
  })
})

describe('contagens', () => {
  it('soma os counts', () => {
    expect(sumCounts([{ count: 2 }, { count: 5 }])).toBe(7)
  })

  it('conta tarefas por status, na ordem pedida', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'done' }),
      makeTask({ id: 't2', status: 'todo' }),
      makeTask({ id: 't3', status: 'done' }),
    ]
    expect(countTasksByStatus(tasks, ['todo', 'done', 'blocked'])).toEqual([
      { status: 'todo', count: 1 },
      { status: 'done', count: 2 },
      { status: 'blocked', count: 0 },
    ])
  })
})
