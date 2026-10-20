import { describe, expect, it } from 'vitest'
import { buildBurnup, lastDoneDateByTask } from './burnup'

const days = ['2026-10-13', '2026-10-14', '2026-10-15']

describe('buildBurnup', () => {
  it('acumula os concluídos por dia e para em hoje', () => {
    const points = buildBurnup({
      days,
      tasks: [
        { id: 'a', status: 'done' },
        { id: 'b', status: 'done' },
        { id: 'c', status: 'todo' },
      ],
      doneDateByTask: new Map([
        ['a', '2026-10-13'],
        ['b', '2026-10-14'],
      ]),
      today: '2026-10-14',
    })
    expect(points.map((point) => point.done)).toEqual([1, 2, null])
  })

  it('a reta ideal vai de 0 ao total de cards', () => {
    const points = buildBurnup({
      days,
      tasks: [
        { id: 'a', status: 'todo' },
        { id: 'b', status: 'todo' },
      ],
      doneDateByTask: new Map(),
      today: '2026-10-15',
    })
    expect(points.map((point) => point.ideal)).toEqual([0, 1, 2])
  })

  it('concluído sem movimentação registrada conta no primeiro dia', () => {
    const points = buildBurnup({
      days,
      tasks: [{ id: 'a', status: 'done' }],
      doneDateByTask: new Map(),
      today: '2026-10-15',
    })
    expect(points[0].done).toBe(1)
  })
})

describe('lastDoneDateByTask', () => {
  it('fica com a última conclusão de cada card', () => {
    const dates = lastDoneDateByTask([
      { taskId: 'a', doneAt: '2026-10-13T12:00:00' },
      { taskId: 'a', doneAt: '2026-10-15T12:00:00' },
    ])
    expect(dates.get('a')).toBe('2026-10-15')
  })
})
