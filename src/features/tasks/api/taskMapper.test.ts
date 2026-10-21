import { describe, expect, it } from 'vitest'
import type { Tables } from '@/shared/types/database.types'
import { toTask, toTaskInsert, toTaskUpdate } from './taskMapper'

const row: Tables<'tasks'> = {
  id: 't1',
  user_id: 'u1',
  task_number: 7,
  title: 'Revisar SM-2',
  description: null,
  status: 'todo',
  priority: 'medium',
  importance: null,
  origin: 'manual',
  project_id: 'p1',
  epic_id: null,
  sprint_id: null,
  assignee_id: null,
  estimated_minutes: null,
  due_date: null,
  due_time: null,
  recurrence_type: null,
  recurrence_interval: null,
  recurrence_day_of_month: null,
  recurrence_end_date: null,
  recurrence_parent_id: null,
  flagged: false,
  flag_note: null,
  ease_factor: null,
  interval: null,
  next_review: null,
  created_at: '2026-10-01T12:00:00Z',
  updated_at: '2026-10-02T12:00:00Z',
  deleted_at: null,
}

describe('toTask', () => {
  it('importância fora de 1 a 5 vira null', () => {
    expect(toTask({ ...row, importance: 4 }).importance).toBe(4)
    expect(toTask({ ...row, importance: 9 }).importance).toBeNull()
  })

  it('converte para camelCase e descarta os campos do banco', () => {
    const task = toTask(row)
    expect(task.number).toBe(7)
    expect(task.projectId).toBe('p1')
    expect(task).not.toHaveProperty('user_id')
    expect(task).not.toHaveProperty('deleted_at')
  })

  it('agrupa prazo; hora sem data vira null', () => {
    expect(
      toTask({ ...row, due_date: '2026-10-21', due_time: '16:25' }).due,
    ).toEqual({ date: '2026-10-21', time: '16:25' })
    expect(toTask({ ...row, due_time: '16:25' }).due).toBeNull()
  })

  it('urgência: nota só existe se urgente', () => {
    expect(toTask({ ...row, flagged: true, flag_note: 'hoje' }).flag).toEqual({
      note: 'hoje',
    })
    expect(toTask({ ...row, flag_note: 'sobrou' }).flag).toBeNull()
  })

  it('recorrência mensal leva o dia do mês; as outras não', () => {
    expect(
      toTask({
        ...row,
        recurrence_type: 'monthly',
        recurrence_day_of_month: 15,
      }).recurrence,
    ).toEqual({ type: 'monthly', interval: 1, dayOfMonth: 15, endDate: null })
    expect(
      toTask({
        ...row,
        recurrence_type: 'weekly',
        recurrence_interval: 2,
        recurrence_day_of_month: 15,
      }).recurrence,
    ).toEqual({ type: 'weekly', interval: 2, endDate: null })
  })

  it('SRS só existe com os três campos', () => {
    const reviewed = {
      ...row,
      ease_factor: 2.5,
      interval: 3,
      next_review: '2026-10-20',
    }
    expect(toTask(reviewed).srs).toEqual({
      easeFactor: 2.5,
      interval: 3,
      nextReview: '2026-10-20',
    })
    expect(toTask({ ...reviewed, next_review: null }).srs).toBeNull()
  })
})

describe('toTaskUpdate', () => {
  it('deixa de fora os grupos que não mudaram', () => {
    expect(toTaskUpdate({ title: 'Novo' })).not.toHaveProperty('due_date')
    expect(toTaskUpdate({ title: 'Novo' })).not.toHaveProperty('flagged')
  })

  it('null limpa todas as colunas do grupo', () => {
    expect(toTaskUpdate({ due: null })).toMatchObject({
      due_date: null,
      due_time: null,
    })
    expect(toTaskUpdate({ flag: null })).toMatchObject({
      flagged: false,
      flag_note: null,
    })
  })

  it('recorrência não mensal zera o dia do mês', () => {
    expect(
      toTaskUpdate({
        recurrence: { type: 'daily', interval: 1, endDate: null },
      }),
    ).toMatchObject({ recurrence_type: 'daily', recurrence_day_of_month: null })
  })
})

describe('toTaskInsert', () => {
  it('envia título e projeto', () => {
    expect(toTaskInsert({ title: 'Novo', projectId: 'p1' })).toMatchObject({
      title: 'Novo',
      project_id: 'p1',
    })
  })
})
