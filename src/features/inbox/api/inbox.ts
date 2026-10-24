import { supabase } from '@/shared/api/supabase'
import { todayLocal } from '@/shared/lib/date'
import { sortByPriorityThenDate } from '@/features/tasks/lib/taskPriority'
import { sortByDueThenPriority } from '@/features/inbox/lib/inboxDue'
import { toTask } from '@/features/tasks/api/taskMapper'
import type { Task } from '@/features/tasks/model/task'

export type InboxData = {
  urgent: Task[]
  srsOverdue: Task[]
  dueByToday: Task[]
}

export async function getInboxItems(): Promise<InboxData> {
  const today = todayLocal()

  const [urgentRes, srsOverdueRes, dueByTodayRes] = await Promise.all([
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
      .lte('due_date', today)
      .eq('flagged', false)
      .not('status', 'in', '(done,blocked)')
      .is('deleted_at', null)
      .or(`next_review.is.null,next_review.gt.${today}`),
  ])

  if (urgentRes.error) {
    throw new Error(`Falha ao buscar urgentes: ${urgentRes.error.message}`)
  }
  if (srsOverdueRes.error) {
    throw new Error(
      `Falha ao buscar SRS vencido: ${srsOverdueRes.error.message}`,
    )
  }
  if (dueByTodayRes.error) {
    throw new Error(`Falha ao buscar prazos: ${dueByTodayRes.error.message}`)
  }

  return {
    urgent: sortByPriorityThenDate(urgentRes.data.map(toTask)),
    srsOverdue: sortByPriorityThenDate(srsOverdueRes.data.map(toTask)),
    dueByToday: sortByDueThenPriority(dueByTodayRes.data.map(toTask)),
  }
}
