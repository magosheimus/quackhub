import { describe, expect, it } from 'vitest'
import type { DraftsItem } from '@/shared/types/entities'
import { makeProject } from '@/test/factories'
import {
  NO_PROJECT_DROPPABLE_ID,
  applyDraftArrangement,
  arrangeDraftsAfterDrop,
  groupDraftsByProject,
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
    project_id: null,
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

function inProject(
  id: string,
  projectId: string | null,
  position = 0,
): DraftsItem {
  return { ...makeDraft(id), project_id: projectId, position }
}

const projects = [
  makeProject({ id: 'p1', name: 'Casa' }),
  makeProject({ id: 'p2', name: 'Estudo' }),
]

function groupIds(pending: DraftsItem[], includeEmpty = false) {
  return groupDraftsByProject(pending, projects, includeEmpty).map((group) => [
    group.droppableId,
    group.items.map((item) => item.id),
  ])
}

describe('groupDraftsByProject', () => {
  it('agrupa por projeto com "Sem projeto" primeiro e omite blocos vazios', () => {
    const pending = [
      inProject('a', 'p2'),
      inProject('b', null),
      inProject('c', 'p2'),
    ]
    expect(groupIds(pending)).toEqual([
      [NO_PROJECT_DROPPABLE_ID, ['b']],
      ['p2', ['a', 'c']],
    ])
  })

  it('põe rascunho de projeto excluído em "Sem projeto"', () => {
    expect(groupIds([inProject('a', 'apagado')])).toEqual([
      [NO_PROJECT_DROPPABLE_ID, ['a']],
    ])
  })

  it('durante o arraste mostra os blocos vazios no fim', () => {
    expect(groupIds([inProject('a', 'p2')], true)).toEqual([
      ['p2', ['a']],
      [NO_PROJECT_DROPPABLE_ID, []],
      ['p1', []],
    ])
  })
})

describe('arrangeDraftsAfterDrop', () => {
  const groups = groupDraftsByProject(
    [
      inProject('a', null),
      inProject('b', null),
      inProject('c', 'p1'),
      inProject('d', 'p1'),
    ],
    projects,
    true,
  )

  it('reordena dentro do bloco sem trocar o projeto', () => {
    expect(
      arrangeDraftsAfterDrop(
        groups,
        { droppableId: NO_PROJECT_DROPPABLE_ID, index: 0 },
        { droppableId: NO_PROJECT_DROPPABLE_ID, index: 1 },
      ),
    ).toEqual({
      draftId: 'a',
      projectId: null,
      movesProject: false,
      orderedIds: ['b', 'a'],
    })
  })

  it('move para outro bloco na posição solta', () => {
    expect(
      arrangeDraftsAfterDrop(
        groups,
        { droppableId: NO_PROJECT_DROPPABLE_ID, index: 1 },
        { droppableId: 'p1', index: 1 },
      ),
    ).toEqual({
      draftId: 'b',
      projectId: 'p1',
      movesProject: true,
      orderedIds: ['c', 'b', 'd'],
    })
  })

  it('move para um bloco vazio', () => {
    expect(
      arrangeDraftsAfterDrop(
        groups,
        { droppableId: 'p1', index: 0 },
        { droppableId: 'p2', index: 0 },
      ),
    ).toEqual({
      draftId: 'c',
      projectId: 'p2',
      movesProject: true,
      orderedIds: ['c'],
    })
  })

  it('ignora soltar no mesmo lugar', () => {
    expect(
      arrangeDraftsAfterDrop(
        groups,
        { droppableId: 'p1', index: 1 },
        { droppableId: 'p1', index: 1 },
      ),
    ).toBeNull()
  })
})

describe('applyDraftArrangement', () => {
  it('troca o projeto do item movido e reordena o bloco de destino', () => {
    const items = [
      inProject('a', null, 0),
      inProject('c', 'p1', 0),
      inProject('d', 'p1', 1),
    ]
    const result = applyDraftArrangement(items, {
      draftId: 'a',
      projectId: 'p1',
      movesProject: true,
      orderedIds: ['c', 'a', 'd'],
    })
    expect(
      result.map((item) => [item.id, item.project_id, item.position]),
    ).toEqual([
      ['c', 'p1', 0],
      ['a', 'p1', 1],
      ['d', 'p1', 2],
    ])
  })
})
