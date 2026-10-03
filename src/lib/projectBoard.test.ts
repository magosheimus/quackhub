import { describe, it, expect } from 'vitest'
import type { Database } from '@/types/database.types'
import { getProjectBucket, sortByStatusOrder } from './projectBoard'

type Task = Database['public']['Tables']['tasks']['Row']

function makeTask(overrides: Partial<Task>): Task {
  return { status: 'todo', sprint_id: null, ...overrides } as Task
}

describe('getProjectBucket', () => {
  it('card não concluído na sprint ativa vai para sprint', () => {
    expect(getProjectBucket(makeTask({ sprint_id: 's1' }), 's1')).toBe('sprint')
  })

  it('card concluído na sprint ativa continua na sprint', () => {
    expect(
      getProjectBucket(makeTask({ sprint_id: 's1', status: 'done' }), 's1'),
    ).toBe('sprint')
  })

  it('card concluído fora da sprint ativa vai para concluídos', () => {
    expect(
      getProjectBucket(makeTask({ sprint_id: 's0', status: 'done' }), 's1'),
    ).toBe('done')
  })

  it('card concluído sem sprint vai para concluídos', () => {
    expect(getProjectBucket(makeTask({ status: 'done' }), 's1')).toBe('done')
  })

  it('card não concluído fora da sprint ativa vai para backlog', () => {
    expect(getProjectBucket(makeTask({ sprint_id: 's0' }), 's1')).toBe(
      'backlog',
    )
  })

  it('sem sprint ativa, concluído vai para concluídos e o resto para backlog', () => {
    expect(getProjectBucket(makeTask({ status: 'done' }), null)).toBe('done')
    expect(getProjectBucket(makeTask({ sprint_id: 's1' }), null)).toBe(
      'backlog',
    )
  })
})

describe('sortByStatusOrder', () => {
  it('ordena pelo fluxo e manda status desconhecidos pro fim', () => {
    const tasks = [
      makeTask({ id: '1', status: 'done' }),
      makeTask({ id: '2', status: 'scheduled' }),
      makeTask({ id: '3', status: 'todo' }),
      makeTask({ id: '4', status: 'doing' }),
    ]
    const sorted = sortByStatusOrder(tasks, ['todo', 'doing', 'done'])
    expect(sorted.map((t) => t.id)).toEqual(['3', '4', '1', '2'])
  })
})
