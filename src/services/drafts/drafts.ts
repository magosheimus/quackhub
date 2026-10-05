import { supabase } from '@/lib/supabase'
import { enqueue, getQueue, clearQueue } from '@/lib/draftsQueue'
import type { Database } from '@/types/database.types'

type DraftsItem = Database['public']['Tables']['drafts_items']['Row']

export async function captureItem(content: string): Promise<DraftsItem | null> {
  const item: DraftsItem = {
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
    .order('created_at', { ascending: false })
  if (error)
    throw new Error(`Falha ao buscar itens do drafts: ${error.message}`)
  return data
}

export async function triageItem(
  id: string,
  decision: { triaged_to: string; triaged_task_id?: string | null },
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
