import { supabase } from '@/lib/supabase'
import { enqueue, getQueue, clearQueue } from '@/lib/inboxQueue'
import type { Database } from '@/types/database.types'

type InboxItem = Database['public']['Tables']['inbox_items']['Row']

export async function captureItem(content: string): Promise<InboxItem | null> {
  const item: InboxItem = {
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
    .from('inbox_items')
    .insert(item)
    .select()
    .single()
  if (error) throw new Error(`Falha ao capturar item: ${error.message}`)
  return data
}

export async function syncInboxQueue(): Promise<void> {
  const queue = getQueue()
  if (queue.length === 0) return

  const { error } = await supabase
    .from('inbox_items')
    .upsert(queue, { onConflict: 'id', ignoreDuplicates: true })
  if (error)
    throw new Error(`Falha ao sincronizar fila do inbox: ${error.message}`)
  clearQueue()
}

export async function getInboxItems(): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from('inbox_items')
    .select('*')
    .is('triaged_at', null)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Falha ao buscar itens do inbox: ${error.message}`)
  return data
}

export async function triageItem(
  id: string,
  decision: { triaged_to: string; triaged_task_id?: string | null },
): Promise<InboxItem> {
  const { data, error } = await supabase
    .from('inbox_items')
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
