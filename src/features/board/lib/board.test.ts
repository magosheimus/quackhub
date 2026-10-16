import { describe, it, expect } from 'vitest'
import {
  applyBoardFilters,
  DEFAULT_BOARD_FILTERS,
  getEpicsInTasks,
  getLabelScope,
  getProjectsInTasks,
  groupTasksByColumn,
  shouldFlagOnDrop,
  isBoardColumnKey,
  getMoveOptions,
} from './board'
import { makeEpic, makeProject, makeTask } from '@/test/factories'

describe('applyBoardFilters', () => {
  const today = '2026-09-29'
  const emptyTags = {}

  it('sem filtros ativos, retorna tudo', () => {
    const tasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })]
    expect(
      applyBoardFilters(tasks, DEFAULT_BOARD_FILTERS, emptyTags, today),
    ).toHaveLength(2)
  })

  it('filtra por flagged', () => {
    const tasks = [
      makeTask({ id: 't1', flagged: true }),
      makeTask({ id: 't2', flagged: false }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, flagged: true },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })

  it('filtra por prioridade', () => {
    const tasks = [
      makeTask({ id: 't1', priority: 'high' }),
      makeTask({ id: 't2', priority: 'low' }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, priority: 'high' },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })

  it('filtra pelas personas escolhidas', () => {
    const tasks = [
      makeTask({ id: 't1', assignee_id: 'p1' }),
      makeTask({ id: 't2', assignee_id: 'p2' }),
      makeTask({ id: 't3', assignee_id: null }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, assigneeIds: ['p1', 'p2'] },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1', 't2'])
  })

  it('filtra por tag', () => {
    const tasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })]
    const tagsMap = { t1: ['urgente'] }
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, tag: 'urgente' },
      tagsMap,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })

  it('filtra SRS vencido (next_review <= hoje)', () => {
    const tasks = [
      makeTask({ id: 't1', next_review: '2026-09-28' }),
      makeTask({ id: 't2', next_review: '2026-09-30' }),
      makeTask({ id: 't3', next_review: null }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, srsOverdue: true },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })

  it('combina múltiplos filtros (AND)', () => {
    const tasks = [
      makeTask({ id: 't1', flagged: true, priority: 'high' }),
      makeTask({ id: 't2', flagged: true, priority: 'low' }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, flagged: true, priority: 'high' },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })
})

describe('isBoardColumnKey', () => {
  it('aceita só colunas do board', () => {
    expect(isBoardColumnKey('to_review')).toBe(true)
    expect(isBoardColumnKey('to_study')).toBe(false)
  })
})

describe('getLabelScope', () => {
  const types = new Map([
    ['p1', 'study' as const],
    ['p2', 'study' as const],
    ['p3', 'general' as const],
  ])

  it('é study quando todos os filtrados são de estudo', () => {
    expect(getLabelScope(['p1', 'p2'], types)).toBe('study')
  })

  it('é null com projeto geral no filtro ou sem filtro', () => {
    expect(getLabelScope(['p1', 'p3'], types)).toBeNull()
    expect(getLabelScope([], types)).toBeNull()
  })
})

describe('opções de filtro da sprint', () => {
  const tasks = [
    makeTask({ id: 't1', project_id: 'p1', epic_id: 'e1' }),
    makeTask({ id: 't2', project_id: 'p1', epic_id: null }),
  ]

  it('lista só projetos com tarefas na sprint', () => {
    const projects = [makeProject({ id: 'p1' }), makeProject({ id: 'p2' })]
    expect(getProjectsInTasks(projects, tasks).map((p) => p.id)).toEqual(['p1'])
  })

  it('lista só épicos com tarefas na sprint', () => {
    const epics = [makeEpic({ id: 'e1' }), makeEpic({ id: 'e2' })]
    expect(getEpicsInTasks(epics, tasks).map((e) => e.id)).toEqual(['e1'])
  })
})

describe('groupTasksByColumn', () => {
  it('distribui as tarefas pelas colunas do board', () => {
    const groups = groupTasksByColumn([
      makeTask({ id: 't1', status: 'to_study' }),
      makeTask({ id: 't2', status: 'doing' }),
      makeTask({ id: 't3', status: 'scheduled' }),
    ])
    expect(groups.todo.map((t) => t.id)).toEqual(['t1'])
    expect(groups.doing.map((t) => t.id)).toEqual(['t2'])
    expect(Object.values(groups).flat()).toHaveLength(2)
  })
})

describe('urgentes no topo da coluna', () => {
  it('coloca os cards flagged antes dos demais, mantendo a ordem', () => {
    const groups = groupTasksByColumn([
      makeTask({ id: 'a', status: 'todo' }),
      makeTask({ id: 'b', status: 'todo', flagged: true }),
      makeTask({ id: 'c', status: 'todo' }),
      makeTask({ id: 'd', status: 'todo', flagged: true }),
    ])
    expect(groups.todo.map((t) => t.id)).toEqual(['b', 'd', 'a', 'c'])
  })
})

describe('shouldFlagOnDrop', () => {
  const card = makeTask({ flagged: false })

  it('marca como urgente ao soltar na primeira posição', () => {
    expect(shouldFlagOnDrop(card, 'doing', 0)).toBe(true)
  })

  it('não marca em outra posição, em Finalizado ou se já é urgente', () => {
    expect(shouldFlagOnDrop(card, 'doing', 2)).toBe(false)
    expect(shouldFlagOnDrop(card, 'done', 0)).toBe(false)
    expect(shouldFlagOnDrop(makeTask({ flagged: true }), 'doing', 0)).toBe(
      false,
    )
  })
})

describe('getMoveOptions', () => {
  it('lista as outras colunas válidas para o tipo, sem a atual', () => {
    expect(getMoveOptions('todo', 'general').map((o) => o.column)).toEqual([
      'doing',
      'blocked',
      'done',
    ])
  })

  it('projeto de estudo inclui A REVISAR com os rótulos de estudo', () => {
    expect(getMoveOptions('to_study', 'study')).toEqual([
      { column: 'doing', label: 'ESTUDANDO' },
      { column: 'to_review', label: 'A REVISAR' },
      { column: 'blocked', label: 'IMPEDIDO' },
      { column: 'done', label: 'FINALIZADO' },
    ])
  })
})
