import { describe, it, expect } from 'vitest'
import { queryKeys } from './queryKeys'

describe('queryKeys', () => {
  it('chaves de tasks começam com tasks.root', () => {
    const keys = [
      queryKeys.tasks.detail('t1'),
      queryKeys.tasks.backlog('p1'),
      queryKeys.tasks.project('p1'),
      queryKeys.tasks.sprint('s1'),
      queryKeys.tasks.similar('p1', 'titulo'),
    ]
    keys.forEach((key) => {
      expect(key.slice(0, 1)).toEqual(queryKeys.tasks.root)
    })
  })

  it('chaves de tags, epics, sprints e analytics começam com o root da família', () => {
    expect(queryKeys.tags.byTask('t1').slice(0, 1)).toEqual(queryKeys.tags.root)
    expect(queryKeys.tags.byProject('p1').slice(0, 1)).toEqual(
      queryKeys.tags.root,
    )
    expect(queryKeys.taskTags.bulk(['a']).slice(0, 1)).toEqual(
      queryKeys.taskTags.root,
    )
    expect(queryKeys.epics.all.slice(0, 1)).toEqual(queryKeys.epics.root)
    expect(queryKeys.epics.byProject('p1').slice(0, 1)).toEqual(
      queryKeys.epics.root,
    )
    expect(queryKeys.sprints.active.slice(0, 1)).toEqual(queryKeys.sprints.root)
    expect(queryKeys.search.byQuery('x').slice(0, 1)).toEqual(
      queryKeys.search.root,
    )
    expect(queryKeys.search.drafts('x').slice(0, 1)).toEqual(
      queryKeys.search.root,
    )
    expect(queryKeys.analytics.srsByTag().slice(0, 1)).toEqual(
      queryKeys.analytics.root,
    )
  })

  it('backlog sem projeto usa "all"', () => {
    expect(queryKeys.tasks.backlog()).toEqual(['tasks', 'backlog', 'all'])
    expect(queryKeys.tasks.backlog(null)).toEqual(['tasks', 'backlog', 'all'])
  })

  it('bulk não altera o array original e ignora a ordem', () => {
    const ids = ['b', 'a']
    expect(queryKeys.taskTags.bulk(ids)).toEqual(
      queryKeys.taskTags.bulk(['a', 'b']),
    )
    expect(ids).toEqual(['b', 'a'])
  })
})
