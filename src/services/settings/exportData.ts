import { supabase } from '@/lib/supabase'

const TABLES = [
  'projects',
  'epics',
  'tasks',
  'task_tags',
  'task_dependencies',
  'task_checklist_items',
  'task_attachments',
  'sprints',
  'srs_logs',
  'task_activity_log',
  'time_entries',
  'inbox_items',
] as const

export async function exportAllData(): Promise<Record<string, unknown[]>> {
  const snapshot: Record<string, unknown[]> = {}

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw new Error(`Falha ao exportar ${table}: ${error.message}`)
    snapshot[table] = data
  }

  return snapshot
}

export function downloadSnapshotAsJson(snapshot: Record<string, unknown[]>) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `quackhub-export-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}
