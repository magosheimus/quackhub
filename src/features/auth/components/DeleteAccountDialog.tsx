import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { AUTH_TEXTS } from '@/features/auth/constants/texts'
import { useDeleteAccountDialog } from '@/features/auth/hooks/useDeleteAccountDialog'
import { COMMON_TEXTS } from '@/shared/constants/texts'

type DeleteAccountDialogProps = {
  accountEmail: string
}

export function DeleteAccountDialog({
  accountEmail,
}: DeleteAccountDialogProps) {
  const {
    open,
    handleOpenChange,
    typedEmail,
    setTypedEmail,
    canConfirm,
    isDeleting,
    confirm,
  } = useDeleteAccountDialog(accountEmail)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        {AUTH_TEXTS.deleteAccount}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{AUTH_TEXTS.deleteAccountTitle}</DialogTitle>
          <DialogDescription>
            {AUTH_TEXTS.deleteAccountWarning}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="delete-account-email" className="text-caption">
            {AUTH_TEXTS.deleteAccountConfirmLabel(accountEmail)}
          </label>
          <Input
            id="delete-account-email"
            type="email"
            autoComplete="off"
            value={typedEmail}
            onChange={(e) => setTypedEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            {COMMON_TEXTS.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={confirm}
            disabled={!canConfirm}
          >
            {isDeleting ? AUTH_TEXTS.deletingAccount : AUTH_TEXTS.deleteAccount}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
