import { supabase } from '@/shared/api/supabase'
import { toTask } from '@/features/tasks/api/taskMapper'
import type { Task } from '@/features/tasks/model/task'
import type { DraftsItem } from '@/shared/types/entities'

export async function searchTasks(query: string): Promise<Task[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const [byContentRes, byTagRes] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
      .is('deleted_at', null),
    supabase
      .from('task_tags')
      .select('task_id')
      .ilike('tag_name', `%${trimmed}%`),
  ])

  if (byContentRes.error) {
    throw new Error(`Falha ao buscar cards: ${byContentRes.error.message}`)
  }
  if (byTagRes.error) {
    throw new Error(`Falha ao buscar por tag: ${byTagRes.error.message}`)
  }

  const taskIdsFromTags = byTagRes.data.map((row) => row.task_id)
  let tasksFromTags: Task[] = []
  if (taskIdsFromTags.length > 0) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .in('id', taskIdsFromTags)
      .is('deleted_at', null)
    if (error) {
      throw new Error(`Falha ao buscar cards por tag: ${error.message}`)
    }
    tasksFromTags = data.map(toTask)
  }

  const merged = new Map<string, Task>()
  for (const task of [...byContentRes.data.map(toTask), ...tasksFromTags]) {
    merged.set(task.id, task)
  }
  return Array.from(merged.values())
}

const DRAFT_RESULTS_LIMIT = 20

// Rascunhos pendentes e arquivados; descartados e transformados em card ficam de fora
export async function searchDrafts(query: string): Promise<DraftsItem[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const { data, error } = await supabase
    .from('drafts_items')
    .select('*')
    .is('triaged_at', null)
    .ilike('content', `%${trimmed}%`)
    .order('created_at', { ascending: false })
    .limit(DRAFT_RESULTS_LIMIT)
  if (error) {
    throw new Error(`Falha ao buscar rascunhos: ${error.message}`)
  }
  return data
}
