import { describe, expect, it } from 'vitest'
import { makeTask } from '@/test/factories'
import { countOverdue, describeDue, sortByDueThenPriority } from './inboxDue'

describe('describeDue', () => {
  const today = '2026-10-15'

  it('sem prazo não mostra nada', () => {
    expect(describeDue(null, today)).toBeNull()
  })

  it('prazo hoje não é atraso', () => {
    expect(describeDue(today, today)).toEqual({
      text: 'vence hoje',
      isOverdue: false,
    })
  })

  it('prazo passado mostra há quantos dias está atrasado', () => {
    expect(describeDue('2026-10-14', today)).toEqual({
      text: 'atrasado há 1 dia',
      isOverdue: true,
    })
    expect(describeDue('2026-10-10', today)?.text).toBe('atrasado há 5 dias')
  })
})

describe('sortByDueThenPriority', () => {
  it('ordena pelo prazo mais antigo e, no mesmo dia, pela prioridade', () => {
    const tasks = [
      makeTask({ id: 'hoje-baixa', due_date: '2026-10-15', priority: 'low' }),
      makeTask({ id: 'hoje-alta', due_date: '2026-10-15', priority: 'high' }),
      makeTask({ id: 'ontem', due_date: '2026-10-14', priority: 'low' }),
    ]
    expect(sortByDueThenPriority(tasks).map((task) => task.id)).toEqual([
      'ontem',
      'hoje-alta',
      'hoje-baixa',
    ])
  })
})

describe('countOverdue', () => {
  it('conta só os prazos que já passaram', () => {
    const tasks = [
      { due_date: '2026-10-15' },
      { due_date: '2026-10-14' },
      { due_date: '2026-10-01' },
      { due_date: null },
    ]
    expect(countOverdue(tasks, '2026-10-15')).toBe(2)
  })
})

describe('prazo com horário na Inbox', () => {
  it('mostra o horário em "vence hoje"', () => {
    expect(describeDue('2026-10-15', '2026-10-15', '14:00:00')?.text).toBe(
      'vence hoje às 14:00',
    )
  })

  it('no mesmo dia ordena pelo horário, sem horário por último', () => {
    const tasks = [
      makeTask({ id: 'sem-hora', due_date: '2026-10-15', due_time: null }),
      makeTask({ id: 'tarde', due_date: '2026-10-15', due_time: '16:00:00' }),
      makeTask({ id: 'manha', due_date: '2026-10-15', due_time: '09:00:00' }),
    ]
    expect(sortByDueThenPriority(tasks).map((task) => task.id)).toEqual([
      'manha',
      'tarde',
      'sem-hora',
    ])
  })
})
