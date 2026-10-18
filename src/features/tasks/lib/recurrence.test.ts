import { describe, it, expect } from 'vitest'
import { makeTask as makeBaseTask } from '@/test/factories'
import { calculateNextDueDate, buildRecurrentCard } from './recurrence'
import type { Task } from '@/features/tasks/model/task'

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
      due: { date: '2026-01-05', time: null },
      recurrence: { type: 'daily', interval: 3, endDate: null },
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-01-08',
    )
  })

  it('semanal: soma o intervalo em semanas', () => {
    const task = makeTask({
      due: { date: '2026-01-05', time: null },
      recurrence: { type: 'weekly', interval: 2, endDate: null },
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-01-19',
    )
  })

  it('mensal dia 31 em fevereiro → dia 28 (2026 não é bissexto)', () => {
    const task = makeTask({
      due: { date: '2026-01-31', time: null },
      recurrence: {
        type: 'monthly',
        interval: 1,
        dayOfMonth: 31,
        endDate: null,
      },
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-02-28',
    )
  })

  it('mensal dia 30 em fevereiro → dia 28 (2026 não é bissexto)', () => {
    const task = makeTask({
      due: { date: '2026-01-30', time: null },
      recurrence: {
        type: 'monthly',
        interval: 1,
        dayOfMonth: 30,
        endDate: null,
      },
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2026-02-28',
    )
  })

  it('anual 29/fev em ano não bissexto → 28/fev', () => {
    const task = makeTask({
      due: { date: '2024-02-29', time: null },
      recurrence: { type: 'yearly', interval: 1, endDate: null },
    })
    expect(calculateNextDueDate(task)?.toISOString().slice(0, 10)).toBe(
      '2025-02-28',
    )
  })

  it('fim da recorrência no passado → retorna null (não cria)', () => {
    const task = makeTask({
      due: { date: '2026-01-05', time: null },
      recurrence: {
        type: 'monthly',
        interval: 1,
        dayOfMonth: 5,
        endDate: '2026-01-10',
      },
    })
    expect(calculateNextDueDate(task)).toBeNull()
  })

  it('sem recorrência → retorna null', () => {
    const task = makeTask({
      due: { date: '2026-01-05', time: null },
      recurrence: null,
    })
    expect(calculateNextDueDate(task)).toBeNull()
  })
})

describe('buildRecurrentCard', () => {
  it('clona os campos relevantes e reseta origin/sprint/status', () => {
    const original = makeTask({
      id: 'task-original',
      title: 'Pagar aluguel',
      recurrence: {
        type: 'monthly',
        interval: 1,
        dayOfMonth: 5,
        endDate: null,
      },
      status: 'done',
      sprintId: 'sprint-1',
      flag: { note: null },
      origin: 'manual',
    })
    const nextDue = new Date(2026, 1, 5)

    const result = buildRecurrentCard(original, nextDue)

    expect(result.title).toBe('Pagar aluguel')
    expect(result.due?.date).toBe('2026-02-05')
    expect(result.status).toBe('todo')
    expect(result.sprintId).toBeNull()
    expect(result.origin).toBe('recurrence')
    expect(result.recurrenceParentId).toBe('task-original')
    expect(result.flag).toBeNull()
  })

  it('mantém o horário e o responsável na próxima ocorrência', () => {
    const original = makeTask({
      due: { date: '2026-01-05', time: '14:00:00' },
      assigneeId: 'persona-1',
      recurrence: { type: 'weekly', interval: 1, endDate: null },
    })
    const result = buildRecurrentCard(original, new Date(2026, 0, 12))
    expect(result.due?.time).toBe('14:00:00')
    expect(result.assigneeId).toBe('persona-1')
  })
})
