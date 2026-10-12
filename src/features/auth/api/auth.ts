import { supabase } from '@/shared/api/supabase'
import { UserFacingError } from '@/shared/lib/errors'
import { getAuthErrorMessage } from '@/features/auth/lib/authErrors'
import { LOGIN_PATH } from '@/features/auth/lib/redirect'
import type { EmailLinkType } from '@/features/auth/lib/emailLink'
import { AUTH_ERRORS } from '@/features/auth/constants/texts'

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw new UserFacingError(getAuthErrorMessage(error.code))
  }
}

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}${LOGIN_PATH}` },
  })
  if (error) {
    throw new UserFacingError(getAuthErrorMessage(error.code))
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(`Falha ao sair: ${error.message}`)
  }
}

export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
  })
  if (error) {
    throw new Error(`Falha ao excluir conta: ${error.message}`)
  }
  await supabase.auth.signOut({ scope: 'local' })
}

export async function verifyEmailLink(
  tokenHash: string,
  type: EmailLinkType,
): Promise<true> {
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  })
  if (error) {
    throw new UserFacingError(AUTH_ERRORS.invalidLink)
  }
  return true
}

export async function updatePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    throw new UserFacingError(getAuthErrorMessage(error.code))
  }
}
