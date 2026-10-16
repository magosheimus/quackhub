import { supabase } from '@/shared/api/supabase'
import {
  enqueue,
  getQueue,
  clearQueue,
} from '@/features/drafts/lib/draftsQueue'
import type {
  NewDraftsItem,
  DraftsItem,
  DraftTriageTarget,
} from '@/shared/types/entities'

export async function captureItem(content: string): Promise<DraftsItem | null> {
  const item: NewDraftsItem = {
    id: crypto.randomUUID(),
    content,
    created_at: new Date().toISOString(),
    triaged_at: null,
    triaged_to: null,
    triaged_task_id: null,
  }

  if (!navigator.onLine) {
    enqueue(item)
    return null
  }

  const { data, error } = await supabase
    .from('drafts_items')
    .insert(item)
    .select()
    .single()
  if (error) throw new Error(`Falha ao capturar item: ${error.message}`)
  return data
}

export async function syncDraftsQueue(): Promise<void> {
  const queue = getQueue()
  if (queue.length === 0) return

  const { error } = await supabase
    .from('drafts_items')
    .upsert(queue, { onConflict: 'id', ignoreDuplicates: true })
  if (error)
    throw new Error(`Falha ao sincronizar fila do drafts: ${error.message}`)
  clearQueue()
}

export async function getDraftsItems(): Promise<DraftsItem[]> {
  const { data, error } = await supabase
    .from('drafts_items')
    .select('*')
    .is('triaged_at', null)
    .order('position')
    .order('created_at', { ascending: false })
  if (error)
    throw new Error(`Falha ao buscar itens do drafts: ${error.message}`)
  return data
}

export async function triageItem(
  id: string,
  decision: { triaged_to: DraftTriageTarget; triaged_task_id?: string | null },
): Promise<DraftsItem> {
  const { data, error } = await supabase
    .from('drafts_items')
    .update({
      triaged_to: decision.triaged_to,
      triaged_task_id: decision.triaged_task_id ?? null,
      triaged_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao triar item: ${error.message}`)
  return data
}

export async function updateDraftContent(
  id: string,
  content: string,
): Promise<void> {
  const { error } = await supabase
    .from('drafts_items')
    .update({ content })
    .eq('id', id)
  if (error) throw new Error(`Falha ao editar rascunho: ${error.message}`)
}

export async function setDraftChecked(
  id: string,
  checked: boolean,
): Promise<void> {
  const { error } = await supabase
    .from('drafts_items')
    .update({ checked_at: checked ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) throw new Error(`Falha ao marcar rascunho: ${error.message}`)
}
