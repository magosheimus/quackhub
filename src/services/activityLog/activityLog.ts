import { supabase } from '@/lib/supabase'
import type { ActivityLog } from '@/types/entities'

export async function getActivityLog(taskId: string): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('task_activity_log')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
  if (error)
    throw new Error(
      `Falha ao buscar histórico de movimentação: ${error.message}`,
    )
  return data
}
