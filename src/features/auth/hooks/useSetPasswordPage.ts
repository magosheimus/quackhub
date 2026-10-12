import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useUpdatePassword } from '@/features/auth/hooks/useAuthMutations'
import { verifyEmailLink } from '@/features/auth/api/auth'
import { readEmailLink } from '@/features/auth/lib/emailLink'
import {
  getPasswordIssue,
  getPasswordIssueMessage,
} from '@/features/auth/lib/password'
import { HOME_PATH, SET_PASSWORD_PATH } from '@/features/auth/lib/redirect'
import { queryKeys } from '@/shared/query/queryKeys'

export function useSetPasswordPage() {
  const navigate = useNavigate()
  const { session, isLoading: isLoadingSession } = useAuth()
  const [emailLink] = useState(() => readEmailLink(window.location.search))
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const { mutate: savePassword, isPending: isSaving } = useUpdatePassword()

  const verification = useQuery({
    queryKey: queryKeys.auth.emailLink(emailLink?.tokenHash ?? ''),
    queryFn: async () => {
      if (!emailLink) {
        return false
      }
      const verified = await verifyEmailLink(
        emailLink.tokenHash,
        emailLink.type,
      )
      window.history.replaceState(null, '', SET_PASSWORD_PATH)
      return verified
    },
    enabled: emailLink !== null,
    retry: false,
    staleTime: Infinity,
    meta: { persist: false },
  })

  const isVerifying = emailLink !== null && verification.isPending
  const hasInvalidLink =
    verification.isError || (!isLoadingSession && !isVerifying && !session)
  const issue = getPasswordIssue(password, confirmation)
  const showIssue = confirmation !== '' && issue !== null

  function submit(event: FormEvent) {
    event.preventDefault()
    if (issue) {
      return
    }
    savePassword(password, {
      onSuccess: () => navigate(HOME_PATH, { replace: true }),
    })
  }

  return {
    isLoading: isLoadingSession || isVerifying,
    hasInvalidLink,
    password,
    setPassword,
    confirmation,
    setConfirmation,
    issueMessage: showIssue ? getPasswordIssueMessage(issue) : null,
    canSubmit: issue === null && !isSaving,
    isSaving,
    submit,
  }
}
