import type { DraftsItem, Project } from '@/shared/types/entities'
import { moveItem } from '@/shared/lib/array'
import { NEUTRAL_COLOR } from '@/shared/lib/palette'
import { toProjectLabel } from '@/features/projects/lib/project'
import { formatMonthYear, getWeekDays, toDbDate } from '@/shared/lib/date'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'

export type DraftsSections = {
  pending: DraftsItem[]
  archived: DraftsItem[]
}

// Concluídos vão para Arquivados, do mais recente para o mais antigo
export function splitDrafts(items: DraftsItem[]): DraftsSections {
  return {
    pending: items.filter((item) => item.checked_at === null),
    archived: items
      .filter((item) => item.checked_at !== null)
      .sort((a, b) => (b.checked_at ?? '').localeCompare(a.checked_at ?? '')),
  }
}

export const ARCHIVE_PAGE_SIZE = 20

export type ArchiveGroup = {
  key: string
  label: string
  items: DraftsItem[]
}

function archivedDate(item: DraftsItem): string {
  return toDbDate(new Date(item.checked_at ?? item.created_at ?? Date.now()))
}

// Agrupa os arquivados (já do mais recente ao mais antigo) em
// "Esta semana", "Este mês" e depois um grupo por mês
export function groupArchivedDrafts(
  items: DraftsItem[],
  today: string,
  weekStartsOn: 0 | 1,
): ArchiveGroup[] {
  const weekStart = getWeekDays(today, weekStartsOn)[0] ?? today
  const currentMonth = today.slice(0, 7)
  const groups = new Map<string, ArchiveGroup>()

  for (const item of items) {
    const date = archivedDate(item)
    const month = date.slice(0, 7)
    const key =
      date >= weekStart ? 'week' : month === currentMonth ? 'month' : month
    const label =
      key === 'week'
        ? DRAFTS_TEXTS.thisWeek
        : key === 'month'
          ? DRAFTS_TEXTS.thisMonth
          : formatMonthYear(month)
    const group = groups.get(key) ?? { key, label, items: [] }
    group.items.push(item)
    groups.set(key, group)
  }
  return [...groups.values()]
}

export function findAdjacentDraft(
  pending: DraftsItem[],
  currentId: string,
  step: 1 | -1,
): DraftsItem | null {
  const index = pending.findIndex((item) => item.id === currentId)
  if (index === -1) {
    return null
  }
  return pending[index + step] ?? null
}

export function findDraftAfterTriage(
  pending: DraftsItem[],
  currentId: string,
): DraftsItem | null {
  return (
    findAdjacentDraft(pending, currentId, 1) ??
    pending.find((item) => item.id !== currentId) ??
    null
  )
}

export function getDraftPosition(
  pending: DraftsItem[],
  currentId: string,
): { current: number; total: number } {
  const index = pending.findIndex((item) => item.id === currentId)
  return { current: index + 1, total: pending.length }
}

export const NO_PROJECT_DROPPABLE_ID = 'no-project'

export type DraftProjectGroup = {
  droppableId: string
  projectId: string | null
  label: string
  color: string
  items: DraftsItem[]
}

export function groupDraftsByProject(
  pending: DraftsItem[],
  projects: Project[],
  includeEmpty: boolean,
): DraftProjectGroup[] {
  const projectIds = new Set(projects.map((project) => project.id))
  const groups: DraftProjectGroup[] = [
    {
      droppableId: NO_PROJECT_DROPPABLE_ID,
      projectId: null,
      label: DRAFTS_TEXTS.noProject,
      color: NEUTRAL_COLOR,
      items: pending.filter(
        (item) => item.project_id === null || !projectIds.has(item.project_id),
      ),
    },
    ...projects.map((project) => ({
      droppableId: project.id,
      projectId: project.id,
      label: project.name,
      color: toProjectLabel(project).color,
      items: pending.filter((item) => item.project_id === project.id),
    })),
  ]
  const filled = groups.filter((group) => group.items.length > 0)
  if (!includeEmpty) {
    return filled
  }
  return [...filled, ...groups.filter((group) => group.items.length === 0)]
}

export type DraftArrangement = {
  draftId: string
  projectId: string | null
  movesProject: boolean
  orderedIds: string[]
}

type DropLocation = { droppableId: string; index: number }

export function arrangeDraftsAfterDrop(
  groups: DraftProjectGroup[],
  source: DropLocation,
  destination: DropLocation,
): DraftArrangement | null {
  const sourceGroup = groups.find((g) => g.droppableId === source.droppableId)
  const targetGroup = groups.find(
    (g) => g.droppableId === destination.droppableId,
  )
  const moved = sourceGroup?.items[source.index]
  if (!sourceGroup || !targetGroup || !moved) {
    return null
  }
  if (sourceGroup === targetGroup) {
    if (source.index === destination.index) {
      return null
    }
    return {
      draftId: moved.id,
      projectId: targetGroup.projectId,
      movesProject: false,
      orderedIds: moveItem(
        targetGroup.items,
        source.index,
        destination.index,
      ).map((item) => item.id),
    }
  }
  const orderedIds = targetGroup.items.map((item) => item.id)
  orderedIds.splice(destination.index, 0, moved.id)
  return {
    draftId: moved.id,
    projectId: targetGroup.projectId,
    movesProject: true,
    orderedIds,
  }
}

function compareDraftOrder(a: DraftsItem, b: DraftsItem): number {
  return (
    a.position - b.position ||
    (b.created_at ?? '').localeCompare(a.created_at ?? '')
  )
}

export function applyDraftArrangement(
  items: DraftsItem[],
  { draftId, projectId, movesProject, orderedIds }: DraftArrangement,
): DraftsItem[] {
  const positionById = new Map(orderedIds.map((id, index) => [id, index]))
  return items
    .map((item) => ({
      ...item,
      position: positionById.get(item.id) ?? item.position,
      project_id:
        movesProject && item.id === draftId ? projectId : item.project_id,
    }))
    .sort(compareDraftOrder)
}
