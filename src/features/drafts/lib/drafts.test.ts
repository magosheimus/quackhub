import { describe, expect, it } from 'vitest'
import type { DraftsItem } from '@/shared/types/entities'
import { groupArchivedDrafts, splitDrafts } from './drafts'

function makeDraft(id: string, checkedAt: string | null = null): DraftsItem {
  return {
    id,
    user_id: 'user-1',
    content: id,
    created_at: '2026-10-01T00:00:00Z',
    checked_at: checkedAt,
    position: 0,
    triaged_at: null,
    triaged_task_id: null,
    triaged_to: null,
  }
}

describe('splitDrafts', () => {
  it('separa pendentes e concluídos, mantendo a ordem dos pendentes', () => {
    const { pending, archived } = splitDrafts([
      makeDraft('a'),
      makeDraft('b', '2026-10-02T10:00:00Z'),
      makeDraft('c'),
      makeDraft('d', '2026-10-03T10:00:00Z'),
    ])
    expect(pending.map((item) => item.id)).toEqual(['a', 'c'])
    expect(archived.map((item) => item.id)).toEqual(['d', 'b'])
  })
})

describe('groupArchivedDrafts', () => {
  const today = '2026-10-16'

  it('agrupa em esta semana, este mês e um grupo por mês anterior', () => {
    const groups = groupArchivedDrafts(
      [
        makeDraft('hoje', '2026-10-16T12:00:00'),
        makeDraft('segunda', '2026-10-12T12:00:00'),
        makeDraft('inicio-do-mes', '2026-10-02T12:00:00'),
        makeDraft('setembro', '2026-09-20T12:00:00'),
      ],
      today,
      1,
    )
    expect(groups.map((group) => [group.label, group.items.length])).toEqual([
      ['Esta semana', 2],
      ['Este mês', 1],
      ['Setembro de 2026', 1],
    ])
  })
})
