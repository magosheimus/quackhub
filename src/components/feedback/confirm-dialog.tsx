import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { IconWarning } from '@/shared/lib/icons'

export const INVERTED_CONFIRM_CLASS =
  'border-2 border-on-accent bg-on-accent text-accent hover:bg-on-accent/85'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  function confirm() {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)} dismissible>
      <DialogContent className="dialog-inverted">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-fg">
            <IconWarning
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {COMMON_TEXTS.cancel}
          </Button>
          <Button className={INVERTED_CONFIRM_CLASS} onClick={confirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
