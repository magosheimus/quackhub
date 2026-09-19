import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type NewProject = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .is('deleted_at', null)
  if (error) throw new Error(`Falha ao buscar projetos: ${error.message}`)
  return data
}

export async function createProject(data: NewProject): Promise<Project> {
  const { data: project, error } = await supabase
    .from('projects').insert(data).select().single()
  if (error) throw new Error(`Falha ao criar projeto: ${error.message}`)
  return project
}

export async function updateProject(id: string, data: ProjectUpdate): Promise<Project> {
  const { data: project, error } = await supabase
    .from('projects').update(data).eq('id', id).select().single()
  if (error) throw new Error(`Falha ao atualizar projeto: ${error.message}`)
  return project
}

export async function softDeleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(`Falha ao arquivar projeto: ${error.message}`)
}
