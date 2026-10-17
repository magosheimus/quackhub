import type { DraftsItem } from '@/shared/types/entities'
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
