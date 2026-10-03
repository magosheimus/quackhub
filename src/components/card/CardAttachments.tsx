import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react'
import {
  Paperclip,
  X,
  File as FileIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAttachments } from '@/hooks/attachments/useAttachments'
import { useUploadAttachment } from '@/hooks/attachments/useUploadAttachment'
import { useDeleteAttachment } from '@/hooks/attachments/useDeleteAttachment'
import { getAttachmentUrl } from '@/services/attachments/attachments'

type CardAttachmentsProps = {
  taskId: string
}

export function CardAttachments({ taskId }: CardAttachmentsProps) {
  const { data: attachments } = useAttachments(taskId)
  const { mutate: upload, isPending } = useUploadAttachment()
  const { mutate: removeAttachment } = useDeleteAttachment()
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [imageSize, setImageSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const images = (attachments ?? []).filter((a) =>
    a.mime_type.startsWith('image/'),
  )

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    upload({ taskId, file })
    e.target.value = ''
  }

  function openViewer(index: number) {
    setImageSize(null)
    setViewerIndex(index)
  }

  function showPrev() {
    setImageSize(null)
    setViewerIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    )
  }

  function showNext() {
    setImageSize(null)
    setViewerIndex((i) => (i === null ? null : (i + 1) % images.length))
  }

  function handleImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const padding = 32
    const maxW = window.innerWidth * 0.85 - padding
    const maxH = window.innerHeight * 0.85 - padding
    const { naturalWidth, naturalHeight } = e.currentTarget
    const scale = Math.min(maxW / naturalWidth, maxH / naturalHeight)
    setImageSize({
      width: naturalWidth * scale,
      height: naturalHeight * scale,
    })
  }

  useEffect(() => {
    if (viewerIndex === null) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerIndex, images.length])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-[--text-primary]">
          Anexos
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Adicionar anexo"
          disabled={isPending}
        >
          <Paperclip size={14} />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => {
            const url = getAttachmentUrl(attachment.storage_path)
            const isImage = attachment.mime_type.startsWith('image/')
            return (
              <div
                key={attachment.id}
                className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-(--radius-md) border border-(--border) bg-[var(--bg-card)]"
              >
                {isImage ? (
                  <button
                    type="button"
                    onClick={() =>
                      openViewer(
                        images.findIndex((i) => i.id === attachment.id),
                      )
                    }
                    className="h-full w-full"
                  >
                    <img
                      src={url}
                      alt={attachment.file_name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 p-1 text-center"
                  >
                    <FileIcon size={20} className="text-[--text-muted]" />
                    <span className="line-clamp-2 text-[10px] text-[--text-muted]">
                      {attachment.file_name}
                    </span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() =>
                    removeAttachment({
                      id: attachment.id,
                      storagePath: attachment.storage_path,
                      taskId,
                    })
                  }
                  aria-label={`Remover anexo ${attachment.file_name}`}
                  className="absolute top-0.5 right-0.5 hidden rounded-full bg-[var(--bg-page)] p-0.5 group-hover:block"
                >
                  <X size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Dialog
        open={viewerIndex !== null}
        onOpenChange={(open) => !open && setViewerIndex(null)}
        dismissible
      >
        <DialogContent className="w-auto! max-h-[85vh]! max-w-[85vw]! overflow-hidden">
          {viewerIndex !== null && (
            <>
              {images.length > 1 && (
                <div className="fixed top-0 bottom-0 left-4 z-50 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={showPrev}
                    aria-label="Anexo anterior"
                  >
                    <ChevronLeft size={24} />
                  </Button>
                </div>
              )}
              <img
                src={getAttachmentUrl(images[viewerIndex].storage_path)}
                alt={images[viewerIndex].file_name}
                onLoad={handleImageLoad}
                style={
                  imageSize
                    ? { width: imageSize.width, height: imageSize.height }
                    : { maxHeight: '85vh', maxWidth: '85vw' }
                }
                className="block"
              />
              {images.length > 1 && (
                <div className="fixed top-0 bottom-0 right-4 z-50 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={showNext}
                    aria-label="Próximo anexo"
                  >
                    <ChevronRight size={24} />
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
