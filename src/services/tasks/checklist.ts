import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type ChecklistItem = Database['public']['Tables']['task_checklist_items']['Row']
type NewChecklistItem =
  Database['public']['Tables']['task_checklist_items']['Insert']
type ChecklistItemUpdate =
  Database['public']['Tables']['task_checklist_items']['Update']

export async function getChecklistItems(
  taskId: string,
): Promise<ChecklistItem[]> {
  const { data, error } = await supabase
    .from('task_checklist_items')
    .select('*')
    .eq('task_id', taskId)
    .order('position', { ascending: true })
  if (error) throw new Error(`Falha ao buscar checklist: ${error.message}`)
  return data
}

export async function createChecklistItem(
  data: NewChecklistItem,
): Promise<ChecklistItem> {
  const { data: item, error } = await supabase
    .from('task_checklist_items')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(`Falha ao criar item: ${error.message}`)
  return item
}

export async function updateChecklistItem(
  id: string,
  data: ChecklistItemUpdate,
): Promise<ChecklistItem> {
  const { data: item, error } = await supabase
    .from('task_checklist_items')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao atualizar item: ${error.message}`)
  return item
}

export async function deleteChecklistItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('task_checklist_items')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`Falha ao remover item: ${error.message}`)
}
