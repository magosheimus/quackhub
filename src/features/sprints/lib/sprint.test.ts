import { describe, it, expect } from 'vitest'
import {
  applyCarryover,
  computeSprintMetrics,
  getClosedSprintsByRecency,
  formatSprintBanner,
  getCompletionPercent,
} from './sprint'
import { makeSprint, makeTask as makeBaseTask } from '@/test/factories'
import type { Task } from '@/shared/types/entities'

function makeTask(overrides: Partial<Task> = {}): Task {
  return makeBaseTask({
    sprint_id: 'sprint-1',
    ...overrides,
  })
}

describe('applyCarryover', () => {
  it('não gera resultado para tasks concluídas', () => {
    const tasks = [makeTask({ id: 't1', status: 'done' })]
    const result = applyCarryover(tasks, {}, 'sprint-2')
    expect(result).toEqual([])
  })

  it('manda to_review sempre pro Backlog (RN-SP03), mesmo se a decisão pedir próxima sprint', () => {
    const tasks = [makeTask({ id: 't1', status: 'to_review' })]
    const result = applyCarryover(tasks, { t1: 'next_sprint' }, 'sprint-2')
    expect(result).toEqual([{ taskId: 't1', sprintId: null }])
  })

  it('aplica a decisão do usuário pra tasks não concluídas e não to_review', () => {
    const tasks = [
      makeTask({ id: 't1', status: 'todo' }),
      makeTask({ id: 't2', status: 'blocked' }),
    ]
    const result = applyCarryover(
      tasks,
      { t1: 'next_sprint', t2: 'backlog' },
      'sprint-2',
    )
    expect(result).toEqual([
      { taskId: 't1', sprintId: 'sprint-2' },
      { taskId: 't2', sprintId: null },
    ])
  })

  it('manda pro backlog quando não há decisão registrada', () => {
    const tasks = [makeTask({ id: 't1', status: 'todo' })]
    const result = applyCarryover(tasks, {}, 'sprint-2')
    expect(result).toEqual([{ taskId: 't1', sprintId: null }])
  })
})

describe('computeSprintMetrics', () => {
  it('calcula total, concluídas e taxa de conclusão', () => {
    const projectNameById = new Map([['project-1', 'QuackHub']])
    const tasks = [
      makeTask({ id: 't1', status: 'done' }),
      makeTask({ id: 't2', status: 'done' }),
      makeTask({ id: 't3', status: 'to_review' }),
      makeTask({ id: 't4', status: 'blocked' }),
    ]
    const metrics = computeSprintMetrics(tasks, projectNameById)

    expect(metrics.total_tasks).toBe(4)
    expect(metrics.completed_tasks).toBe(2)
    expect(metrics.completion_rate).toBe(0.5)
  })

  it('to_review não conta como concluída', () => {
    const projectNameById = new Map([['project-1', 'QuackHub']])
    const tasks = [
      makeTask({ id: 't1', status: 'done' }),
      makeTask({ id: 't2', status: 'to_review' }),
    ]
    const metrics = computeSprintMetrics(tasks, projectNameById)

    expect(metrics.completed_tasks).toBe(1)
    expect(metrics.completion_rate).toBe(0.5)
  })

  it('retorna taxa 0 quando não há tasks (evita divisão por zero)', () => {
    const metrics = computeSprintMetrics([], new Map())
    expect(metrics.completion_rate).toBe(0)
  })

  it('quebra completion_by_project por projeto, já que a sprint é global', () => {
    const projectNameById = new Map([
      ['project-1', 'QuackHub'],
      ['project-2', 'Revalida'],
    ])
    const tasks = [
      makeTask({ id: 't1', project_id: 'project-1', status: 'done' }),
      makeTask({ id: 't2', project_id: 'project-1', status: 'todo' }),
      makeTask({ id: 't3', project_id: 'project-2', status: 'done' }),
    ]
    const metrics = computeSprintMetrics(tasks, projectNameById)

    expect(metrics.completion_by_project).toHaveLength(2)
    expect(metrics.completion_by_project).toEqual(
      expect.arrayContaining([
        {
          project_id: 'project-1',
          project_name: 'QuackHub',
          total: 2,
          completed: 1,
          rate: 0.5,
        },
        {
          project_id: 'project-2',
          project_name: 'Revalida',
          total: 1,
          completed: 1,
          rate: 1,
        },
      ]),
    )
  })
})

describe('getClosedSprintsByRecency', () => {
  it('mantém só as encerradas, da mais recente para a mais antiga', () => {
    const sprints = [
      makeSprint({ id: 's1', status: 'closed', end_date: '2026-01-11' }),
      makeSprint({ id: 's2', status: 'active', end_date: '2026-03-01' }),
      makeSprint({ id: 's3', status: 'closed', end_date: '2026-02-08' }),
    ]

    expect(getClosedSprintsByRecency(sprints).map((s) => s.id)).toEqual([
      's3',
      's1',
    ])
  })
})

describe('getCompletionPercent', () => {
  it('converte a taxa em porcentagem arredondada', () => {
    expect(getCompletionPercent(makeSprint({ completion_rate: 0.666 }))).toBe(
      67,
    )
  })

  it('trata taxa ausente como zero', () => {
    expect(getCompletionPercent(makeSprint({ completion_rate: null }))).toBe(0)
  })
})

describe('formatSprintBanner', () => {
  it('inclui nome, meta e período', () => {
    const sprint = makeSprint({
      name: 'Sprint 8',
      goal: 'Revisar GO',
      start_date: '2026-10-05',
      end_date: '2026-10-11',
    })
    expect(formatSprintBanner(sprint)).toBe(
      'Sprint 8 — Revisar GO (05/10 - 11/10)',
    )
  })

  it('omite a meta quando vazia', () => {
    const sprint = makeSprint({ name: 'Sprint 8', goal: null })
    expect(formatSprintBanner(sprint)).toBe('Sprint 8 (05/01 - 11/01)')
  })
})
