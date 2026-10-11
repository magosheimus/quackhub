import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  useSignIn,
  useSignInWithGoogle,
} from '@/features/auth/hooks/useAuthMutations'
import { readOAuthError } from '@/features/auth/lib/authErrors'
import { getRedirectTarget } from '@/features/auth/lib/redirect'

export function useLoginPage() {
  const { session, isLoading: isLoadingSession } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [oauthError] = useState(() => readOAuthError(window.location))

  const { mutate: signIn, isPending: isSigningIn } = useSignIn()
  const { mutate: startGoogleSignIn, isPending: isRedirecting } =
    useSignInWithGoogle()

  function submit(event: FormEvent) {
    event.preventDefault()
    signIn({ email: email.trim(), password })
  }

  return {
    isLoadingSession,
    isSignedIn: session !== null,
    redirectTo: getRedirectTarget(location.state),
    oauthError,
    email,
    setEmail,
    password,
    setPassword,
    canSubmit: email.trim() !== '' && password !== '' && !isSigningIn,
    isSigningIn,
    submit,
    signInWithGoogle: () => startGoogleSignIn(),
    isRedirecting,
  }
}
