import { describe, it, expect } from 'vitest'
import { makeEpic, makeTask } from '@/test/factories'
import {
  getEpicIdForColumn,
  getProjectBucket,
  groupOpenTasksByEpic,
  NO_EPIC_COLUMN,
  sortByStatusOrder,
} from './projectBoard'

describe('getProjectBucket', () => {
  it('card não concluído na sprint ativa vai para sprint', () => {
    expect(getProjectBucket(makeTask({ sprintId: 's1' }), 's1')).toBe('sprint')
  })

  it('card concluído na sprint ativa continua na sprint', () => {
    expect(
      getProjectBucket(makeTask({ sprintId: 's1', status: 'done' }), 's1'),
    ).toBe('sprint')
  })

  it('card concluído fora da sprint ativa vai para concluídos', () => {
    expect(
      getProjectBucket(makeTask({ sprintId: 's0', status: 'done' }), 's1'),
    ).toBe('done')
  })

  it('card concluído sem sprint vai para concluídos', () => {
    expect(getProjectBucket(makeTask({ status: 'done' }), 's1')).toBe('done')
  })

  it('card não concluído fora da sprint ativa vai para backlog', () => {
    expect(getProjectBucket(makeTask({ sprintId: 's0' }), 's1')).toBe('backlog')
  })

  it('sem sprint ativa, concluído vai para concluídos e o resto para backlog', () => {
    expect(getProjectBucket(makeTask({ status: 'done' }), null)).toBe('done')
    expect(getProjectBucket(makeTask({ sprintId: 's1' }), null)).toBe('backlog')
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

describe('groupOpenTasksByEpic', () => {
  const physics = makeEpic({ id: 'e1', name: 'Física' })
  const chemistry = makeEpic({ id: 'e2', name: 'Química' })

  it('uma coluna por épico só com o que falta fazer, sprint antes do backlog', () => {
    const tasks = [
      makeTask({ id: 't1', epicId: 'e1' }),
      makeTask({ id: 't2', epicId: 'e1', sprintId: 's1' }),
      makeTask({ id: 't3', epicId: 'e1', status: 'done' }),
    ]
    const [first, second] = groupOpenTasksByEpic(
      tasks,
      [physics, chemistry],
      's1',
    )
    expect(first.tasks.map((task) => task.id)).toEqual(['t2', 't1'])
    expect(first.doneCount).toBe(1)
    expect(first.totalCount).toBe(3)
    expect(second.tasks).toEqual([])
  })

  it('sem épico (ou épico apagado) vai para a coluna "Sem épico", que só aparece se tiver card', () => {
    const tasks = [
      makeTask({ id: 't1', epicId: null }),
      makeTask({ id: 't2', epicId: 'apagado' }),
    ]
    const columns = groupOpenTasksByEpic(tasks, [physics], null)
    expect(columns.map((column) => column.id)).toEqual(['e1', NO_EPIC_COLUMN])
    expect(columns[1].tasks.map((task) => task.id)).toEqual(['t1', 't2'])
    expect(groupOpenTasksByEpic([], [physics], null)).toHaveLength(1)
  })

  it('a coluna "Sem épico" volta a ser épico nulo', () => {
    expect(getEpicIdForColumn(NO_EPIC_COLUMN)).toBeNull()
    expect(getEpicIdForColumn('e1')).toBe('e1')
  })
})
