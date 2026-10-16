import { supabase } from '@/shared/api/supabase'

export type PositionedTable =
  | 'epics'
  | 'projects'
  | 'drafts_items'
  | 'habits'
  | 'task_checklist_items'
  | 'task_links'

export async function savePositions(
  table: PositionedTable,
  orderedIds: string[],
): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, position) =>
      supabase.from(table).update({ position }).eq('id', id),
    ),
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw new Error(`Falha ao reordenar ${table}: ${failed.error.message}`)
  }
}
