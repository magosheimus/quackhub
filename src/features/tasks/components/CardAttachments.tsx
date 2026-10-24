import { SectionLabel } from '@/components/layout/section-label'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react'
import {
  IconAttachment,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconFile,
  IconPlus,
} from '@/shared/lib/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAttachments } from '@/features/tasks/hooks/attachments/useAttachments'
import { useUploadAttachment } from '@/features/tasks/hooks/attachments/useUploadAttachment'
import { useDeleteAttachment } from '@/features/tasks/hooks/attachments/useDeleteAttachment'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { Panel } from '@/components/layout/panel'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import type { AttachmentWithUrl } from '@/shared/types/entities'

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
  const [pendingRemoval, setPendingRemoval] =
    useState<AttachmentWithUrl | null>(null)

  const images = (attachments ?? []).filter((a) =>
    a.mime_type.startsWith('image/'),
  )

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    upload({ taskId, file })
    e.target.value = ''
  }

  function openViewer(index: number) {
    setImageSize(null)
    setViewerIndex(index)
  }

  function confirmRemove() {
    if (!pendingRemoval) {
      return
    }
    removeAttachment({
      id: pendingRemoval.id,
      storagePath: pendingRemoval.storage_path,
      taskId,
    })
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
    if (viewerIndex === null) {
      return
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        showPrev()
      }
      if (e.key === 'ArrowRight') {
        showNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerIndex, images.length])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <SectionLabel icon={IconAttachment}>
          {TASKS_TEXTS.attachments}
        </SectionLabel>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label={TASKS_TEXTS.addAttachment}
          disabled={isPending}
        >
          <IconPlus size={16} />
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
            const isImage = attachment.mime_type.startsWith('image/')
            return (
              <Panel
                key={attachment.id}
                className="group relative flex h-28 w-28 items-center justify-center overflow-hidden p-0"
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
                      src={attachment.url ?? undefined}
                      alt={attachment.file_name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ) : (
                  <a
                    title={attachment.file_name}
                    href={attachment.url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 p-1 text-center"
                  >
                    <IconFile size={16} className="text-fg-muted" />
                    <span className="line-clamp-2 break-all text-[10px] text-fg-muted">
                      {attachment.file_name}
                    </span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPendingRemoval(attachment)}
                  aria-label={TASKS_TEXTS.removeAttachment(
                    attachment.file_name,
                  )}
                  className="absolute top-0.5 right-0.5 rounded-full bg-page p-0.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                >
                  <IconClose size={12} />
                </button>
              </Panel>
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
                    aria-label={TASKS_TEXTS.previousAttachment}
                  >
                    <IconChevronLeft size={16} />
                  </Button>
                </div>
              )}
              <img
                src={images[viewerIndex].url ?? undefined}
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
                    aria-label={TASKS_TEXTS.nextAttachment}
                  >
                    <IconChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
        title={TASKS_TEXTS.removeAttachmentTitle}
        description={TASKS_TEXTS.confirmRemoveAttachment(
          pendingRemoval?.file_name ?? '',
        )}
        confirmLabel={TASKS_TEXTS.removeAttachmentConfirm}
        onConfirm={confirmRemove}
      />
    </div>
  )
}
