import { describe, it, expect } from 'vitest'
import { makeTask as makeBaseTask } from '@/test/factories'
import { detectRecurrencePattern } from './cardSearch'
import type { Task } from '@/features/tasks/model/task'

function makeTask(overrides: Partial<Task> = {}): Task {
  return makeBaseTask({
    title: 'Pagar aluguel',
    ...overrides,
  })
}

describe('detectRecurrencePattern', () => {
  it('detecta padrão com 3 cards em 3 meses diferentes', () => {
    const cards = [
      makeTask({ id: 't1', createdAt: '2026-05-05T00:00:00Z' }),
      makeTask({ id: 't2', createdAt: '2026-06-05T00:00:00Z' }),
      makeTask({ id: 't3', createdAt: '2026-07-05T00:00:00Z' }),
    ]
    expect(detectRecurrencePattern(cards)).toBe(true)
  })

  it('detecta padrão com 2 meses diferentes', () => {
    const cards = [
      makeTask({ id: 't1', createdAt: '2026-05-05T00:00:00Z' }),
      makeTask({ id: 't2', createdAt: '2026-06-05T00:00:00Z' }),
    ]
    expect(detectRecurrencePattern(cards)).toBe(true)
  })

  it('não detecta com um único card', () => {
    const cards = [makeTask({ id: 't1', createdAt: '2026-05-05T00:00:00Z' })]
    expect(detectRecurrencePattern(cards)).toBe(false)
  })

  it('não detecta quando todos os cards são do mesmo mês', () => {
    const cards = [
      makeTask({ id: 't1', createdAt: '2026-05-05T00:00:00Z' }),
      makeTask({ id: 't2', createdAt: '2026-05-10T00:00:00Z' }),
      makeTask({ id: 't3', createdAt: '2026-05-20T00:00:00Z' }),
    ]
    expect(detectRecurrencePattern(cards)).toBe(false)
  })

  it('retorna false pra lista vazia', () => {
    expect(detectRecurrencePattern([])).toBe(false)
  })
})
