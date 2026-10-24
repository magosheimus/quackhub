import { describe, expect, it } from 'vitest'
import { makeTask } from '@/test/factories'
import { applyTaskOrder, compareTaskOrder, sortByImportance } from './taskOrder'

describe('compareTaskOrder', () => {
  it('ordena pela posição e, no empate, do mais novo para o mais antigo', () => {
    const tasks = [
      makeTask({ id: 'old', position: 0, createdAt: '2026-10-01T00:00:00Z' }),
      makeTask({ id: 'last', position: 1, createdAt: '2026-10-03T00:00:00Z' }),
      makeTask({ id: 'new', position: 0, createdAt: '2026-10-02T00:00:00Z' }),
    ]
    expect([...tasks].sort(compareTaskOrder).map((task) => task.id)).toEqual([
      'new',
      'old',
      'last',
    ])
  })
})

describe('applyTaskOrder', () => {
  it('renumera só os cards reordenados e mantém os outros', () => {
    const tasks = [
      makeTask({ id: 'a', position: 0 }),
      makeTask({ id: 'b', position: 1 }),
      makeTask({ id: 'other', position: 5 }),
    ]
    const result = applyTaskOrder(tasks, ['b', 'a'])
    expect(result.map((task) => [task.id, task.position])).toEqual([
      ['b', 0],
      ['a', 1],
      ['other', 5],
    ])
  })
})

describe('sortByImportance', () => {
  it('vai de mais para menos estrelas, sem nota no fim e empate na ordem atual', () => {
    const tasks = [
      makeTask({ id: 'none', importance: null }),
      makeTask({ id: 'three-a', importance: 3 }),
      makeTask({ id: 'five', importance: 5 }),
      makeTask({ id: 'three-b', importance: 3 }),
    ]
    expect(sortByImportance(tasks).map((task) => task.id)).toEqual([
      'five',
      'three-a',
      'three-b',
      'none',
    ])
  })
})
