import { useState } from 'react'
import { useDeleteAccount } from '@/features/auth/hooks/useAuthMutations'
import { isDeletionConfirmed } from '@/features/auth/lib/accountDeletion'

export function useDeleteAccountDialog(accountEmail: string) {
  const [open, setOpen] = useState(false)
  const [typedEmail, setTypedEmail] = useState('')
  const { mutate, isPending } = useDeleteAccount()

  function handleOpenChange(next: boolean) {
    if (isPending) {
      return
    }
    setOpen(next)
    if (!next) {
      setTypedEmail('')
    }
  }

  return {
    open,
    handleOpenChange,
    typedEmail,
    setTypedEmail,
    canConfirm: isDeletionConfirmed(typedEmail, accountEmail) && !isPending,
    isDeleting: isPending,
    confirm: () => mutate(),
  }
}
