import { supabase } from '@/shared/api/supabase'
import { getCurrentUserId } from '@/shared/api/session'
import type { Attachment, AttachmentWithUrl } from '@/shared/types/entities'
import {
  ATTACHMENTS_BUCKET,
  SIGNED_URL_TTL_SECONDS,
} from '@/features/tasks/constants/attachments'
import {
  buildAttachmentPath,
  exceedsAttachmentSizeLimit,
} from '@/features/tasks/lib/attachmentPath'
import { UserFacingError } from '@/shared/lib/errors'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

export async function getAttachments(
  taskId: string,
): Promise<AttachmentWithUrl[]> {
  const { data, error } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(`Falha ao buscar anexos: ${error.message}`)
  if (data.length === 0) return []

  const { data: signed, error: signError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrls(
      data.map((attachment) => attachment.storage_path),
      SIGNED_URL_TTL_SECONDS,
    )
  if (signError)
    throw new Error(`Falha ao gerar links dos anexos: ${signError.message}`)

  const urlByPath = new Map(signed.map((item) => [item.path, item.signedUrl]))
  return data.map((attachment) => ({
    ...attachment,
    url: urlByPath.get(attachment.storage_path) ?? null,
  }))
}

export async function uploadAttachment(
  taskId: string,
  file: File,
): Promise<Attachment> {
  if (exceedsAttachmentSizeLimit(file)) {
    throw new UserFacingError(TASKS_TEXTS.attachmentTooLarge)
  }

  const userId = await getCurrentUserId()
  const storagePath = buildAttachmentPath(userId, taskId, file.name)

  const { error: uploadError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
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
    .from(ATTACHMENTS_BUCKET)
    .remove([storagePath])
  if (storageError)
    throw new Error(`Falha ao remover arquivo: ${storageError.message}`)

  const { error } = await supabase
    .from('task_attachments')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`Falha ao remover anexo: ${error.message}`)
}
