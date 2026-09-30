import { describe, it, expect } from 'vitest'
import { applyBoardFilters, DEFAULT_BOARD_FILTERS } from './board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 'task-1',
    project_id: 'project-1',
    epic_id: null,
    sprint_id: null,
    title: 'Tarefa',
    description: null,
    status: 'todo',
    priority: 'média',
    flagged: false,
    flag_note: null,
    due_date: null,
    recurrence_type: null,
    recurrence_interval: null,
    recurrence_day_of_month: null,
    recurrence_end_date: null,
    recurrence_parent_id: null,
    origem: 'manual',
    interval: null,
    ease_factor: null,
    next_review: null,
    task_number: null,
    estimated_minutes: null,
    updated_at: '2026-01-01T00:00:00Z',
    deleted_at: null,
    created_at: '2026-01-05T00:00:00Z',
    ...overrides,
  }
}

describe('applyBoardFilters', () => {
  const today = '2026-09-29'
  const emptyTags = new Map<string, string[]>()

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
      makeTask({ id: 't1', priority: 'alta' }),
      makeTask({ id: 't2', priority: 'baixa' }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, priority: 'alta' },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })

  it('filtra por tag', () => {
    const tasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })]
    const tagsMap = new Map([['t1', ['urgente']]])
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
      makeTask({ id: 't1', flagged: true, priority: 'alta' }),
      makeTask({ id: 't2', flagged: true, priority: 'baixa' }),
    ]
    const result = applyBoardFilters(
      tasks,
      { ...DEFAULT_BOARD_FILTERS, flagged: true, priority: 'alta' },
      emptyTags,
      today,
    )
    expect(result.map((t) => t.id)).toEqual(['t1'])
  })
})
