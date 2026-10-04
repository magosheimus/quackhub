import { supabase } from '@/lib/supabase'
import { todayLocal } from '@/lib/srs'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

const PRIORITY_WEIGHT: Record<string, number> = {
  alta: 0,
  média: 1,
  baixa: 2,
}

function sortByPriorityThenDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const priorityDiff =
      (PRIORITY_WEIGHT[a.priority] ?? 99) - (PRIORITY_WEIGHT[b.priority] ?? 99)
    if (priorityDiff !== 0) return priorityDiff
    return (a.created_at ?? '').localeCompare(b.created_at ?? '')
  })
}

export type InboxData = {
  urgent: Task[]
  srsOverdue: Task[]
  dueToday: Task[]
}

export async function getInboxItems(): Promise<InboxData> {
  const today = todayLocal()

  const [urgentRes, srsOverdueRes, dueTodayRes] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('flagged', true)
      .not('status', 'in', '(done,blocked)')
      .is('deleted_at', null),
    supabase
      .from('tasks')
      .select('*')
      .lte('next_review', today)
      .eq('flagged', false)
      .not('status', 'in', '(done,blocked)')
      .is('deleted_at', null),
    supabase
      .from('tasks')
      .select('*')
      .eq('due_date', today)
      .eq('flagged', false)
      .not('status', 'in', '(done,blocked)')
      .is('deleted_at', null)
      .or(`next_review.is.null,next_review.gt.${today}`),
  ])

  if (urgentRes.error)
    throw new Error(`Falha ao buscar urgentes: ${urgentRes.error.message}`)
  if (srsOverdueRes.error)
    throw new Error(
      `Falha ao buscar SRS vencido: ${srsOverdueRes.error.message}`,
    )
  if (dueTodayRes.error)
    throw new Error(`Falha ao buscar prazo hoje: ${dueTodayRes.error.message}`)

  return {
    urgent: sortByPriorityThenDate(urgentRes.data),
    srsOverdue: sortByPriorityThenDate(srsOverdueRes.data),
    dueToday: sortByPriorityThenDate(dueTodayRes.data),
  }
}
