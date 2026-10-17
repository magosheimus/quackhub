import { describe, expect, it } from 'vitest'
import type { DraftsItem } from '@/shared/types/entities'
import {
  findAdjacentDraft,
  findDraftAfterTriage,
  getDraftPosition,
  groupArchivedDrafts,
  splitDrafts,
} from './drafts'

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

describe('navegação entre rascunhos', () => {
  const pending = [makeDraft('a'), makeDraft('b'), makeDraft('c')]

  it('anda para o anterior e o seguinte, sem passar das pontas', () => {
    expect(findAdjacentDraft(pending, 'b', -1)?.id).toBe('a')
    expect(findAdjacentDraft(pending, 'b', 1)?.id).toBe('c')
    expect(findAdjacentDraft(pending, 'a', -1)).toBeNull()
    expect(findAdjacentDraft(pending, 'c', 1)).toBeNull()
  })

  it('depois de virar card, vai para o seguinte ou volta ao primeiro que sobrou', () => {
    expect(findDraftAfterTriage(pending, 'b')?.id).toBe('c')
    expect(findDraftAfterTriage(pending, 'c')?.id).toBe('a')
    expect(findDraftAfterTriage([makeDraft('a')], 'a')).toBeNull()
  })

  it('mostra a posição na lista', () => {
    expect(getDraftPosition(pending, 'b')).toEqual({ current: 2, total: 3 })
  })
})
