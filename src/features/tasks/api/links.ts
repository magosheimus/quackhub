import { supabase } from '@/shared/api/supabase'
import type { NewTaskLink, TaskLink } from '@/shared/types/entities'

export async function getTaskLinks(taskId: string): Promise<TaskLink[]> {
  const { data, error } = await supabase
    .from('task_links')
    .select('*')
    .eq('task_id', taskId)
    .order('position')
    .order('created_at')
  if (error) throw new Error(`Falha ao buscar links: ${error.message}`)
  return data
}

export async function createTaskLink(data: NewTaskLink): Promise<TaskLink> {
  const { data: link, error } = await supabase
    .from('task_links')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(`Falha ao adicionar link: ${error.message}`)
  return link
}

export async function deleteTaskLink(id: string): Promise<void> {
  const { error } = await supabase.from('task_links').delete().eq('id', id)
  if (error) throw new Error(`Falha ao remover link: ${error.message}`)
}
