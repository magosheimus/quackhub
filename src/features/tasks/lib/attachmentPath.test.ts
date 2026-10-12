import { describe, expect, it } from 'vitest'
import {
  buildAttachmentPath,
  exceedsAttachmentSizeLimit,
} from './attachmentPath'
import { MAX_ATTACHMENT_SIZE_BYTES } from '@/features/tasks/constants/attachments'

describe('buildAttachmentPath', () => {
  it('começa pela pasta do dono, exigida pela policy do storage', () => {
    expect(buildAttachmentPath('user-1', 'task-1', 'a.png', 'file-1')).toBe(
      'user-1/task-1/file-1-a.png',
    )
  })

  it('gera um id diferente por arquivo', () => {
    expect(buildAttachmentPath('u', 't', 'a.png')).not.toBe(
      buildAttachmentPath('u', 't', 'a.png'),
    )
  })

  it('remove acentos e caracteres que o storage recusa', () => {
    expect(buildAttachmentPath('u', 't', 'Ação final (v2).pdf', 'f')).toBe(
      'u/t/f-Acao_final_v2_.pdf',
    )
  })
})

describe('exceedsAttachmentSizeLimit', () => {
  function fileOfSize(size: number): File {
    return new File([new Uint8Array(size)], 'a.bin')
  }

  it('aceita arquivo no limite', () => {
    expect(
      exceedsAttachmentSizeLimit(fileOfSize(MAX_ATTACHMENT_SIZE_BYTES)),
    ).toBe(false)
  })

  it('recusa arquivo acima do limite', () => {
    expect(
      exceedsAttachmentSizeLimit(fileOfSize(MAX_ATTACHMENT_SIZE_BYTES + 1)),
    ).toBe(true)
  })
})
