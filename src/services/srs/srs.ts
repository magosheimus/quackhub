import { supabase } from '@/lib/supabase'
import {
  calculateQuality,
  calculateNewEF,
  calculateNextInterval,
  todayLocal,
  addDaysToToday,
} from '@/lib/srs'
import { getTaskById, updateTask } from '@/services/tasks/tasks'
import type { Database } from '@/types/database.types'

type SrsLog = Database['public']['Tables']['srs_logs']['Row']

export async function registerPerformance(
  taskId: string,
  nota: number,
  confianca: number,
  comment?: string,
): Promise<SrsLog> {
  const task = await getTaskById(taskId)
  const quality = calculateQuality(nota, confianca)
  const newEF = calculateNewEF(task.ease_factor ?? 2.5, quality)
  const newInterval = calculateNextInterval(task.interval, newEF, quality)
  const nextReview = addDaysToToday(newInterval)

  await updateTask(taskId, {
    sprint_id: task.sprint_id,
    ease_factor: newEF,
    interval: newInterval,
    next_review: nextReview,
  })

  const { data, error } = await supabase
    .from('srs_logs')
    .insert({
      task_id: taskId,
      sprint_id: task.sprint_id,
      log_type: 'srs',
      session_date: todayLocal(),
      nota,
      confianca,
      quality,
      new_ef: newEF,
      new_interval: newInterval,
      comment: comment ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(`Falha ao registrar desempenho: ${error.message}`)
  return data
}

export async function addManualComment(
  taskId: string,
  comment: string,
): Promise<SrsLog> {
  const { data, error } = await supabase
    .from('srs_logs')
    .insert({
      task_id: taskId,
      log_type: 'manual',
      session_date: todayLocal(),
      comment,
    })
    .select()
    .single()
  if (error) throw new Error(`Falha ao salvar observação: ${error.message}`)
  return data
}

export async function getSrsLogs(taskId: string): Promise<SrsLog[]> {
  const { data, error } = await supabase
    .from('srs_logs')
    .select('*')
    .eq('task_id', taskId)
    .order('session_date', { ascending: false })
  if (error) throw new Error(`Falha ao buscar histórico: ${error.message}`)
  return data
}
