import { supabase } from '@/shared/api/supabase'
import { getCurrentUserId } from '@/shared/api/session'
import {
  normalizeSettings,
  type Settings,
} from '@/features/settings/lib/settings'

export async function fetchRemoteSettings(): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('settings')
    .maybeSingle()
  if (error) {
    throw new Error(`Falha ao carregar preferências: ${error.message}`)
  }
  return data ? normalizeSettings(data.settings) : null
}

export async function saveRemoteSettings(settings: Settings): Promise<void> {
  const userId = await getCurrentUserId()
  const { error } = await supabase.from('user_settings').upsert({
    user_id: userId,
    settings,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    throw new Error(`Falha ao salvar preferências: ${error.message}`)
  }
}
