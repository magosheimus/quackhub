import { describe, it, expect } from 'vitest'
import { detectRecurrencePattern } from './cardSearch'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 'task-1',
    project_id: 'project-1',
    epic_id: null,
    sprint_id: null,
    title: 'Pagar aluguel',
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
    created_at: '2026-01-05T00:00:00Z',
    ...overrides,
  }
}

describe('detectRecurrencePattern', () => {
  it('detecta padrão com 3 cards em 3 meses diferentes', () => {
    const cards = [
      makeTask({ id: 't1', created_at: '2026-05-05T00:00:00Z' }),
      makeTask({ id: 't2', created_at: '2026-06-05T00:00:00Z' }),
      makeTask({ id: 't3', created_at: '2026-07-05T00:00:00Z' }),
    ]
    expect(detectRecurrencePattern(cards)).toBe(true)
  })

  it('detecta padrão com 2 meses diferentes', () => {
    const cards = [
      makeTask({ id: 't1', created_at: '2026-05-05T00:00:00Z' }),
      makeTask({ id: 't2', created_at: '2026-06-05T00:00:00Z' }),
    ]
    expect(detectRecurrencePattern(cards)).toBe(true)
  })

  it('não detecta com um único card', () => {
    const cards = [makeTask({ id: 't1', created_at: '2026-05-05T00:00:00Z' })]
    expect(detectRecurrencePattern(cards)).toBe(false)
  })

  it('não detecta quando todos os cards são do mesmo mês', () => {
    const cards = [
      makeTask({ id: 't1', created_at: '2026-05-05T00:00:00Z' }),
      makeTask({ id: 't2', created_at: '2026-05-10T00:00:00Z' }),
      makeTask({ id: 't3', created_at: '2026-05-20T00:00:00Z' }),
    ]
    expect(detectRecurrencePattern(cards)).toBe(false)
  })

  it('retorna false pra lista vazia', () => {
    expect(detectRecurrencePattern([])).toBe(false)
  })
})
