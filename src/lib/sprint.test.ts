import { describe, it, expect } from 'vitest'
import { applyCarryover, computeSprintMetrics } from './sprint'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 'task-1',
    project_id: 'project-1',
    epic_id: null,
    sprint_id: 'sprint-1',
    title: 'Task de teste',
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
    updated_at: '2026-01-01T00:00:00Z',
    deleted_at: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
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
