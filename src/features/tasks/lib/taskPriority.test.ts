import { describe, it, expect } from 'vitest'
import { makeTask } from '@/test/factories'
import { sortByPriorityThenDate } from './taskPriority'

describe('sortByPriorityThenDate', () => {
  it('ordena alta → média → baixa', () => {
    const tasks = [
      makeTask({ id: 'low', priority: 'low' }),
      makeTask({ id: 'high', priority: 'high' }),
      makeTask({ id: 'medium', priority: 'medium' }),
    ]
    expect(sortByPriorityThenDate(tasks).map((t) => t.id)).toEqual([
      'high',
      'medium',
      'low',
    ])
  })

  it('no empate, a mais antiga vem primeiro', () => {
    const tasks = [
      makeTask({ id: 'new', createdAt: '2026-02-01T00:00:00Z' }),
      makeTask({ id: 'old', createdAt: '2026-01-01T00:00:00Z' }),
    ]
    expect(sortByPriorityThenDate(tasks).map((t) => t.id)).toEqual([
      'old',
      'new',
    ])
  })

  it('não altera o array original', () => {
    const tasks = [
      makeTask({ id: 'low', priority: 'low' }),
      makeTask({ id: 'high', priority: 'high' }),
    ]
    sortByPriorityThenDate(tasks)
    expect(tasks.map((t) => t.id)).toEqual(['low', 'high'])
  })
})
