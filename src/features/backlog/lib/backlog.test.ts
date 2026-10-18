import { describe, it, expect } from 'vitest'
import { makeProject, makeTask } from '@/test/factories'
import {
  EMPTY_BACKLOG_FILTERS,
  filterBacklogTasks,
  groupTasksByProject,
  readBacklogFilters,
  writeBacklogFilters,
} from './backlog'

const NO_FILTERS = {
  status: null,
  priority: null,
  epicId: null,
  tag: null,
  assigneeId: null,
}
const NO_TAGS = {}

describe('filterBacklogTasks', () => {
  const tasks = [
    makeTask({ id: 't1', status: 'todo', priority: 'high', epicId: 'e1' }),
    makeTask({ id: 't2', status: 'doing', priority: 'low', epicId: 'e2' }),
    makeTask({ id: 't3', status: 'todo', priority: 'low', epicId: null }),
  ]

  it('sem filtros devolve todas as tarefas', () => {
    expect(filterBacklogTasks(tasks, NO_FILTERS, NO_TAGS)).toHaveLength(3)
  })

  it('combina os filtros de status, prioridade e épico', () => {
    const ids = (filters: Parameters<typeof filterBacklogTasks>[1]) =>
      filterBacklogTasks(tasks, filters, NO_TAGS).map((task) => task.id)

    expect(ids({ ...NO_FILTERS, status: 'todo' })).toEqual(['t1', 't3'])
    expect(ids({ ...NO_FILTERS, priority: 'low' })).toEqual(['t2', 't3'])
    expect(ids({ ...NO_FILTERS, epicId: 'e2' })).toEqual(['t2'])
    expect(ids({ ...NO_FILTERS, status: 'todo', priority: 'low' })).toEqual([
      't3',
    ])
  })
})

describe('filtro de persona no backlog', () => {
  it('mantém só os cards da persona escolhida', () => {
    const tasks = [
      makeTask({ id: 't1', assigneeId: 'p1' }),
      makeTask({ id: 't2', assigneeId: null }),
    ]
    const result = filterBacklogTasks(
      tasks,
      { ...NO_FILTERS, assigneeId: 'p1' },
      NO_TAGS,
    )
    expect(result.map((task) => task.id)).toEqual(['t1'])
  })
})

describe('filtro de tag no backlog', () => {
  const tasks = [makeTask({ id: 't1' }), makeTask({ id: 't2' })]

  it('mantém só os cards com a tag escolhida', () => {
    const result = filterBacklogTasks(
      tasks,
      { ...NO_FILTERS, tag: 'GO' },
      { t1: ['GO', 'Pediatria'], t2: ['Cirurgia'] },
    )
    expect(result.map((task) => task.id)).toEqual(['t1'])
  })
})

describe('groupTasksByProject', () => {
  it('agrupa na ordem dos projetos e omite projetos sem tarefas', () => {
    const projects = [
      makeProject({ id: 'p1' }),
      makeProject({ id: 'p2' }),
      makeProject({ id: 'p3' }),
    ]
    const tasks = [
      makeTask({ id: 't1', projectId: 'p3' }),
      makeTask({ id: 't2', projectId: 'p1' }),
      makeTask({ id: 't3', projectId: 'p3' }),
    ]

    const groups = groupTasksByProject(projects, tasks)

    expect(groups.map((group) => group.project.id)).toEqual(['p1', 'p3'])
    expect(groups[1].tasks.map((task) => task.id)).toEqual(['t1', 't3'])
  })
})

describe('filtros do Backlog na URL', () => {
  it('ida e volta mantém os filtros', () => {
    const filters = {
      ...EMPTY_BACKLOG_FILTERS,
      projectId: 'p1',
      status: 'todo' as const,
      assigneeId: 'a1',
    }
    const params = writeBacklogFilters(new URLSearchParams(), filters)
    expect(readBacklogFilters(params)).toEqual(filters)
  })

  it('omite os vazios e ignora valores inválidos', () => {
    expect(
      writeBacklogFilters(
        new URLSearchParams('tag=x'),
        EMPTY_BACKLOG_FILTERS,
      ).toString(),
    ).toBe('')
    expect(readBacklogFilters(new URLSearchParams('status=xyz')).status).toBe(
      null,
    )
  })
})
