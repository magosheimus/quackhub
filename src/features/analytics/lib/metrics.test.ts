import { describe, it, expect } from 'vitest'
import {
  ALL_SCOPE,
  CURRENT_SCOPE,
  countTasksByStatus,
  getAccuracyPercent,
  getRelevantStatuses,
  hasStudyContent,
  toStatusShares,
  completionByAssignee,
  groupQualityByWeek,
  resolveLiveSprintId,
  startOfWeek,
  sumCounts,
  toAccuracyChartData,
} from './metrics'
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

describe('getRelevantStatuses', () => {
  const types = new Map([
    ['g', 'general' as const],
    ['s', 'study' as const],
  ])

  it('sem projeto de estudo, esconde os status de estudo', () => {
    const tasks = [{ projectId: 'g', status: 'todo' as const }]
    expect(getRelevantStatuses(tasks, types)).toEqual([
      'todo',
      'doing',
      'blocked',
      'done',
    ])
  })

  it('com projeto de estudo, mostra os dois conjuntos', () => {
    const tasks = [
      { projectId: 'g', status: 'todo' as const },
      { projectId: 's', status: 'to_study' as const },
    ]
    expect(getRelevantStatuses(tasks, types)).toContain('to_review')
    expect(getRelevantStatuses(tasks, types)).toContain('doing')
  })
})

describe('hasStudyContent', () => {
  const types = new Map([
    ['g', 'general' as const],
    ['s', 'study' as const],
  ])

  it('sprint só com projetos gerais e sem revisão não tem estudo', () => {
    expect(hasStudyContent([{ projectId: 'g' }], types, 0, false)).toBe(false)
  })

  it('card de estudo ou revisão registrada mostram a seção', () => {
    expect(hasStudyContent([{ projectId: 's' }], types, 0, false)).toBe(true)
    expect(hasStudyContent([{ projectId: 'g' }], types, 3, false)).toBe(true)
  })

  it('em todas as sprints, basta existir projeto de estudo', () => {
    expect(hasStudyContent([], types, 0, true)).toBe(true)
  })
})

describe('toStatusShares', () => {
  it('calcula a fatia de cada status no total', () => {
    const shares = toStatusShares([
      { status: 'todo', count: 3 },
      { status: 'done', count: 1 },
    ])
    expect(shares.map((share) => share.percent)).toEqual([75, 25])
  })

  it('sem cards, todas as fatias são zero', () => {
    expect(toStatusShares([{ status: 'todo', count: 0 }])[0].percent).toBe(0)
  })
})

describe('completionByAssignee', () => {
  it('conta concluídos por responsável, sem responsável por último', () => {
    const result = completionByAssignee([
      { assigneeId: null, status: 'todo' },
      { assigneeId: 'a', status: 'done' },
      { assigneeId: 'b', status: 'done' },
      { assigneeId: 'b', status: 'todo' },
    ])
    expect(result).toEqual([
      { assigneeId: 'b', completed: 1, total: 2 },
      { assigneeId: 'a', completed: 1, total: 1 },
      { assigneeId: null, completed: 0, total: 1 },
    ])
  })
})
