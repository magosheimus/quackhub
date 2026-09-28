import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Attachment = Database['public']['Tables']['task_attachments']['Row']

const BUCKET = 'task-attachments'

export async function getAttachments(taskId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(`Falha ao buscar anexos: ${error.message}`)
  return data
}

export async function uploadAttachment(
  taskId: string,
  file: File,
): Promise<Attachment> {
  const storagePath = `${taskId}/${crypto.randomUUID()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file)
  if (uploadError)
    throw new Error(`Falha ao enviar arquivo: ${uploadError.message}`)

  const { data, error } = await supabase
    .from('task_attachments')
    .insert({
      task_id: taskId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
    })
    .select()
    .single()
  if (error) throw new Error(`Falha ao salvar anexo: ${error.message}`)
  return data
}

export async function deleteAttachment(
  id: string,
  storagePath: string,
): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath])
  if (storageError)
    throw new Error(`Falha ao remover arquivo: ${storageError.message}`)

  const { error } = await supabase
    .from('task_attachments')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`Falha ao remover anexo: ${error.message}`)
}

export function getAttachmentUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}
