import { supabase } from '@/lib/supabase'
import { groupQualityByWeek, type AccuracyOverTimeItem } from '@/lib/analytics'
import type { ProjectCompletion } from '@/lib/sprint'

export type ConfidenceDistributionItem = {
  confianca: number
  count: number
}

export async function getConfidenceDistribution(
  projectId?: string | null,
): Promise<ConfidenceDistributionItem[]> {
  let query = supabase
    .from('srs_logs')
    .select('confianca, tasks!inner(project_id)')
    .eq('log_type', 'srs')
    .not('confianca', 'is', null)

  if (projectId) {
    query = query.eq('tasks.project_id', projectId)
  }

  const { data, error } = await query
  if (error)
    throw new Error(
      `Falha ao buscar distribuição de confiança: ${error.message}`,
    )

  const counts = new Map<number, number>()
  for (const row of data) {
    if (row.confianca === null) continue
    counts.set(row.confianca, (counts.get(row.confianca) ?? 0) + 1)
  }

  return [1, 2, 3, 4, 5].map((confianca) => ({
    confianca,
    count: counts.get(confianca) ?? 0,
  }))
}

export async function getAccuracyOverTime(
  projectId?: string | null,
): Promise<AccuracyOverTimeItem[]> {
  let query = supabase
    .from('srs_logs')
    .select('session_date, quality, tasks!inner(project_id)')
    .eq('log_type', 'srs')
    .not('quality', 'is', null)
    .order('session_date', { ascending: true })

  if (projectId) {
    query = query.eq('tasks.project_id', projectId)
  }

  const { data, error } = await query
  if (error)
    throw new Error(`Falha ao buscar evolução de acerto: ${error.message}`)

  return groupQualityByWeek(data)
}

export type SprintHistoryItem = {
  id: string
  name: string
  end_date: string | null
  total_tasks: number
  completed_tasks: number
  completion_rate: number
}

export async function getSprintHistory(
  projectId?: string | null,
): Promise<SprintHistoryItem[]> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('status', 'closed')
    .is('deleted_at', null)
    .order('end_date', { ascending: true })
  if (error)
    throw new Error(`Falha ao buscar histórico de sprints: ${error.message}`)

  return data.map((sprint) => {
    if (!projectId) {
      return {
        id: sprint.id,
        name: sprint.name,
        end_date: sprint.end_date,
        total_tasks: sprint.total_tasks ?? 0,
        completed_tasks: sprint.completed_tasks ?? 0,
        completion_rate: sprint.completion_rate ?? 0,
      }
    }

    const byProject =
      (sprint.completion_by_project as ProjectCompletion[] | null) ?? []
    const projectStats = byProject.find((p) => p.project_id === projectId)
    return {
      id: sprint.id,
      name: sprint.name,
      end_date: sprint.end_date,
      total_tasks: projectStats?.total ?? 0,
      completed_tasks: projectStats?.completed ?? 0,
      completion_rate: projectStats?.rate ?? 0,
    }
  })
}

export type CompletionRateOverTimeItem = {
  sprintName: string
  rate: number
}

export async function getCompletionRateOverTime(
  projectId?: string | null,
): Promise<CompletionRateOverTimeItem[]> {
  const history = await getSprintHistory(projectId)
  return history.map((s) => ({
    sprintName: s.name,
    rate: Math.round(s.completion_rate * 100),
  }))
}

export type SRSMetricsByTag = {
  tag: string
  averageQuality: number
  count: number
}

export async function getSRSMetricsByTag(
  projectId?: string | null,
): Promise<SRSMetricsByTag[]> {
  let logsQuery = supabase
    .from('srs_logs')
    .select('task_id, quality, tasks!inner(project_id)')
    .eq('log_type', 'srs')
    .not('quality', 'is', null)

  if (projectId) {
    logsQuery = logsQuery.eq('tasks.project_id', projectId)
  }

  const { data: logs, error: logsError } = await logsQuery
  if (logsError)
    throw new Error(`Falha ao buscar logs de SRS: ${logsError.message}`)

  const taskIds = Array.from(new Set(logs.map((l) => l.task_id)))
  if (taskIds.length === 0) return []

  const { data: tagRows, error: tagsError } = await supabase
    .from('task_tags')
    .select('task_id, tag_name')
    .in('task_id', taskIds)
  if (tagsError)
    throw new Error(`Falha ao buscar tags das tasks: ${tagsError.message}`)

  const tagsByTask = new Map<string, string[]>()
  for (const row of tagRows) {
    const existing = tagsByTask.get(row.task_id) ?? []
    existing.push(row.tag_name)
    tagsByTask.set(row.task_id, existing)
  }

  const buckets = new Map<string, { sum: number; count: number }>()
  for (const log of logs) {
    if (log.quality === null) continue
    const tags = tagsByTask.get(log.task_id) ?? []
    for (const tag of tags) {
      const bucket = buckets.get(tag) ?? { sum: 0, count: 0 }
      bucket.sum += log.quality
      bucket.count += 1
      buckets.set(tag, bucket)
    }
  }

  return Array.from(buckets.entries())
    .map(([tag, { sum, count }]) => ({
      tag,
      averageQuality: sum / count,
      count,
    }))
    .sort((a, b) => b.count - a.count)
}
