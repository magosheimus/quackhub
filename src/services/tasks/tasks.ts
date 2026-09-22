import { supabase } from '@/lib/supabase'
import type { TaskStatus } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
  if (error) throw new Error(`Falha ao buscar tasks: ${error.message}`)
  return data
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<Task> {
  const { data: task, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error)
    throw new Error(`Falha ao atualizar status da task: ${error.message}`)
  return task
}
