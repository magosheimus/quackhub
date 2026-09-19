import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Epic = Database['public']['Tables']['epics']['Row']
type NewEpic = Database['public']['Tables']['epics']['Insert']
type EpicUpdate = Database['public']['Tables']['epics']['Update']

export async function getEpicsByProject(projectId: string): Promise<Epic[]> {
  const { data, error } = await supabase
    .from('epics')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
  if (error) throw new Error(`Falha ao buscar épicos: ${error.message}`)
  return data
}

export async function createEpic(data: NewEpic): Promise<Epic> {
  const { data: epic, error } = await supabase
    .from('epics')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(`Falha ao criar épico: ${error.message}`)
  return epic
}

export async function updateEpic(id: string, data: EpicUpdate): Promise<Epic> {
  const { data: epic, error } = await supabase
    .from('epics')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao atualizar épico: ${error.message}`)
  return epic
}

export async function softDeleteEpic(id: string): Promise<void> {
  const { error } = await supabase
    .from('epics')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(`Falha ao arquivar épico: ${error.message}`)
}
