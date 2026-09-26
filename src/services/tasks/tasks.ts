import { supabase } from '@/lib/supabase'
import type { TaskStatus } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .not('sprint_id', 'is', null)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
  if (error) throw new Error(`Falha ao buscar tasks: ${error.message}`)
  return data
}

export async function getBacklogTasks(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .is('sprint_id', null)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
  if (error) throw new Error(`Falha ao buscar backlog: ${error.message}`)
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

export async function getTasksBySprintId(sprintId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('sprint_id', sprintId)
    .is('deleted_at', null)
  if (error)
    throw new Error(`Falha ao buscar tasks da sprint: ${error.message}`)
  return data
}

export async function updateTaskSprint(
  id: string,
  sprintId: string | null,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ sprint_id: sprintId })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao mover task: ${error.message}`)
  return data
}
