import { describe, it, expect } from 'vitest'
import { makeTask as makeBaseTask } from '@/test/factories'
import { calculateNextDueDate, buildRecurrentCard } from './recurrence'
import type { Task } from '@/shared/types/entities'

function makeTask(overrides: Partial<Task> = {}): Task {
  return makeBaseTask({
    title: 'Pagar aluguel',
    status: 'done',
    ...overrides,
  })
}

describe('calculateNextDueDate', () => {
  it('diária: soma o intervalo em dias', () => {
    const task = makeTask({
      due_date: '2026-01-05',
      recurrence_type: 'daily',
      recurrence_interval: 3,
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-01-08',
    )
  })

  it('semanal: soma o intervalo em semanas', () => {
    const task = makeTask({
      due_date: '2026-01-05',
      recurrence_type: 'weekly',
      recurrence_interval: 2,
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-01-19',
    )
  })

  it('mensal dia 31 em fevereiro → dia 28 (2026 não é bissexto)', () => {
    const task = makeTask({
      due_date: '2026-01-31',
      recurrence_type: 'monthly',
      recurrence_interval: 1,
      recurrence_day_of_month: 31,
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-02-28',
    )
  })

  it('mensal dia 30 em fevereiro → dia 28 (2026 não é bissexto)', () => {
    const task = makeTask({
      due_date: '2026-01-30',
      recurrence_type: 'monthly',
      recurrence_interval: 1,
      recurrence_day_of_month: 30,
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-02-28',
    )
  })

  it('anual 29/fev em ano não bissexto → 28/fev', () => {
    const task = makeTask({
      due_date: '2024-02-29',
      recurrence_type: 'yearly',
      recurrence_interval: 1,
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2025-02-28',
    )
  })

  it('recurrence_end_date no passado → retorna null (não cria)', () => {
    const task = makeTask({
      due_date: '2026-01-05',
      recurrence_type: 'monthly',
      recurrence_interval: 1,
      recurrence_day_of_month: 5,
      recurrence_end_date: '2026-01-10',
    })
    expect(calculateNextDueDate(task)).toBeNull()
  })

  it('sem recorrência → retorna null', () => {
    const task = makeTask({ due_date: '2026-01-05', recurrence_type: null })
    expect(calculateNextDueDate(task)).toBeNull()
  })
})

describe('buildRecurrentCard', () => {
  it('clona os campos relevantes e reseta origin/sprint/status', () => {
    const original = makeTask({
      id: 'task-original',
      title: 'Pagar aluguel',
      recurrence_type: 'monthly',
      recurrence_interval: 1,
      recurrence_day_of_month: 5,
      status: 'done',
      sprint_id: 'sprint-1',
      flagged: true,
      origin: 'manual',
    })
    const nextDue = new Date(2026, 1, 5)

    const result = buildRecurrentCard(original, nextDue)

    expect(result.title).toBe('Pagar aluguel')
    expect(result.due_date).toBe('2026-02-05')
    expect(result.status).toBe('todo')
    expect(result.sprint_id).toBeNull()
    expect(result.origin).toBe('recurrence')
    expect(result.recurrence_parent_id).toBe('task-original')
    expect(result.flagged).toBe(false)
  })

  it('mantém o horário e o responsável na próxima ocorrência', () => {
    const original = makeTask({
      due_date: '2026-01-05',
      due_time: '14:00:00',
      assignee_id: 'persona-1',
      recurrence_type: 'weekly',
    })
    const result = buildRecurrentCard(original, new Date(2026, 0, 12))
    expect(result.due_time).toBe('14:00:00')
    expect(result.assignee_id).toBe('persona-1')
  })
})
