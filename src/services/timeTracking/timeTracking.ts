import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type TimeEntry = Database['public']['Tables']['time_entries']['Row']

export async function startTimer(taskId: string): Promise<TimeEntry> {
  const { data, error } = await supabase
    .from('time_entries')
    .insert({ task_id: taskId, started_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw new Error(`Falha ao iniciar cronômetro: ${error.message}`)
  return data
}

export async function stopTimer(entryId: string): Promise<TimeEntry> {
  const { data, error } = await supabase
    .from('time_entries')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', entryId)
    .select()
    .single()
  if (error) throw new Error(`Falha ao parar cronômetro: ${error.message}`)
  return data
}

export async function getTrackedSeconds(taskId: string): Promise<number> {
  const { data, error } = await supabase
    .from('time_entries')
    .select('started_at, ended_at')
    .eq('task_id', taskId)
    .not('ended_at', 'is', null)
  if (error)
    throw new Error(`Falha ao buscar tempo registrado: ${error.message}`)

  const finished = data.filter(
    (entry): entry is { started_at: string; ended_at: string } =>
      entry.ended_at !== null,
  )

  return finished.reduce((total, entry) => {
    const seconds =
      (new Date(entry.ended_at).getTime() -
        new Date(entry.started_at).getTime()) /
      1000
    return total + seconds
  }, 0)
}

export async function addManualEntry(
  taskId: string,
  startedAt: string,
  endedAt: string,
): Promise<TimeEntry> {
  const { data, error } = await supabase
    .from('time_entries')
    .insert({ task_id: taskId, started_at: startedAt, ended_at: endedAt })
    .select()
    .single()
  if (error)
    throw new Error(`Falha ao adicionar entrada manual: ${error.message}`)
  return data
}
