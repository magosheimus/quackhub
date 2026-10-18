import { describe, expect, it } from 'vitest'
import { makeTask } from '@/test/factories'
import { countOverdue, sortByDueThenPriority } from './inboxDue'

describe('sortByDueThenPriority', () => {
  it('ordena pelo prazo mais antigo e, no mesmo dia, pela prioridade', () => {
    const tasks = [
      makeTask({
        id: 'hoje-baixa',
        due: { date: '2026-10-15', time: null },
        priority: 'low',
      }),
      makeTask({
        id: 'hoje-alta',
        due: { date: '2026-10-15', time: null },
        priority: 'high',
      }),
      makeTask({
        id: 'ontem',
        due: { date: '2026-10-14', time: null },
        priority: 'low',
      }),
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
      { due: { date: '2026-10-15', time: null } },
      { due: { date: '2026-10-14', time: null } },
      { due: { date: '2026-10-01', time: null } },
      { due: null },
    ]
    expect(countOverdue(tasks, '2026-10-15')).toBe(2)
  })
})

describe('prazo com horário na Inbox', () => {
  it('no mesmo dia ordena pelo horário, sem horário por último', () => {
    const tasks = [
      makeTask({ id: 'sem-hora', due: { date: '2026-10-15', time: null } }),
      makeTask({ id: 'tarde', due: { date: '2026-10-15', time: '16:00:00' } }),
      makeTask({ id: 'manha', due: { date: '2026-10-15', time: '09:00:00' } }),
    ]
    expect(sortByDueThenPriority(tasks).map((task) => task.id)).toEqual([
      'manha',
      'tarde',
      'sem-hora',
    ])
  })
})
