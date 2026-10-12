import { MAX_ATTACHMENT_SIZE_BYTES } from '@/features/tasks/constants/attachments'

function toStorageSafeName(fileName: string): string {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w.-]+/g, '_')
}

export function buildAttachmentPath(
  userId: string,
  taskId: string,
  fileName: string,
  fileId: string = crypto.randomUUID(),
): string {
  return `${userId}/${taskId}/${fileId}-${toStorageSafeName(fileName)}`
}

export function exceedsAttachmentSizeLimit(file: File): boolean {
  return file.size > MAX_ATTACHMENT_SIZE_BYTES
}
