import { supabase } from '@/shared/api/supabase'
import type { Epic, EpicUpdate, NewEpic } from '@/shared/types/entities'

export async function getEpicsByProject(projectId: string): Promise<Epic[]> {
  const { data, error } = await supabase
    .from('epics')
    .select('*')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('position')
    .order('created_at')
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

export async function getAllEpics(): Promise<Epic[]> {
  const { data, error } = await supabase
    .from('epics')
    .select('*')
    .is('deleted_at', null)
    .order('position')
    .order('created_at')
  if (error) throw new Error(`Falha ao buscar épicos: ${error.message}`)
  return data
}

export async function reorderEpics(orderedIds: string[]): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, position) =>
      supabase.from('epics').update({ position }).eq('id', id),
    ),
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw new Error(`Falha ao reordenar épicos: ${failed.error.message}`)
  }
}
