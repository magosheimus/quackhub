import { supabase } from '@/shared/api/supabase'
import { UserFacingError } from '@/shared/lib/errors'
import { getAuthErrorMessage } from '@/features/auth/lib/authErrors'
import { LOGIN_PATH } from '@/features/auth/lib/redirect'

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
