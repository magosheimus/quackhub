import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export async function searchTasks(query: string): Promise<Task[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

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

  if (byContentRes.error)
    throw new Error(`Falha ao buscar cards: ${byContentRes.error.message}`)
  if (byTagRes.error)
    throw new Error(`Falha ao buscar por tag: ${byTagRes.error.message}`)

  const taskIdsFromTags = byTagRes.data.map((row) => row.task_id)
  let tasksFromTags: Task[] = []
  if (taskIdsFromTags.length > 0) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .in('id', taskIdsFromTags)
      .is('deleted_at', null)
    if (error)
      throw new Error(`Falha ao buscar cards por tag: ${error.message}`)
    tasksFromTags = data
  }

  const merged = new Map<string, Task>()
  for (const task of [...byContentRes.data, ...tasksFromTags]) {
    merged.set(task.id, task)
  }
  return Array.from(merged.values())
}
