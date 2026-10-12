import { supabase } from '@/shared/api/supabase'

export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession()
  const userId = data.session?.user.id
  if (error || !userId) {
    throw new Error('Sessão expirada: faça login novamente')
  }
  return userId
}
