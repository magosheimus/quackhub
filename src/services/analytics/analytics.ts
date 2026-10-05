import { supabase } from '@/lib/supabase'
import { groupQualityByWeek, type AccuracyOverTimeItem } from '@/lib/analytics'
import type { ProjectCompletion } from '@/lib/sprint'

export type ConfidenceDistributionItem = {
  confianca: number
  count: number
}

export async function getConfidenceDistribution(
  sprintId?: string | null,
): Promise<ConfidenceDistributionItem[]> {
  let query = supabase
    .from('srs_logs')
    .select('confianca')
    .eq('log_type', 'srs')
    .not('confianca', 'is', null)

  if (sprintId) {
    query = query.eq('sprint_id', sprintId)
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
  sprintId?: string | null,
): Promise<AccuracyOverTimeItem[]> {
  let query = supabase
    .from('srs_logs')
    .select('session_date, quality')
    .eq('log_type', 'srs')
    .not('quality', 'is', null)
    .order('session_date', { ascending: true })

  if (sprintId) {
    query = query.eq('sprint_id', sprintId)
  }

  const { data, error } = await query
  if (error)
    throw new Error(`Falha ao buscar evolução de acerto: ${error.message}`)

  return groupQualityByWeek(data)
}

export type CompletionByProjectItem = {
  projectName: string
  total: number
  completed: number
}

export async function getCompletionByProject(
  sprintId: string,
): Promise<CompletionByProjectItem[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('status, projects!inner(name)')
    .eq('sprint_id', sprintId)
    .is('deleted_at', null)
  if (error)
    throw new Error(`Falha ao buscar conclusão por projeto: ${error.message}`)

  const byProject = new Map<string, CompletionByProjectItem>()
  for (const task of data) {
    const name = task.projects.name
    const item = byProject.get(name) ?? {
      projectName: name,
      total: 0,
      completed: 0,
    }
    item.total += 1
    if (task.status === 'done') item.completed += 1
    byProject.set(name, item)
  }

  return Array.from(byProject.values()).sort((a, b) => b.total - a.total)
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

export type ConfidenceCalibrationItem = {
  confianca: number
  averageQuality: number
  count: number
}

export async function getConfidenceCalibration(
  sprintId?: string | null,
): Promise<ConfidenceCalibrationItem[]> {
  let query = supabase
    .from('srs_logs')
    .select('confianca, quality')
    .eq('log_type', 'srs')
    .not('confianca', 'is', null)
    .not('quality', 'is', null)

  if (sprintId) {
    query = query.eq('sprint_id', sprintId)
  }

  const { data, error } = await query
  if (error)
    throw new Error(`Falha ao buscar calibração de confiança: ${error.message}`)

  const buckets = new Map<number, { sum: number; count: number }>()
  for (const row of data) {
    if (row.confianca === null || row.quality === null) continue
    const bucket = buckets.get(row.confianca) ?? { sum: 0, count: 0 }
    bucket.sum += row.quality
    bucket.count += 1
    buckets.set(row.confianca, bucket)
  }

  return [1, 2, 3, 4, 5].map((confianca) => {
    const bucket = buckets.get(confianca)
    return {
      confianca,
      count: bucket?.count ?? 0,
      averageQuality: bucket ? bucket.sum / bucket.count : 0,
    }
  })
}

export type ReviewsByEpicItem = {
  epicName: string
  count: number
  color: string | null
}

export async function getReviewsByEpic(
  sprintId?: string | null,
): Promise<ReviewsByEpicItem[]> {
  let query = supabase.from('srs_logs').select('task_id').eq('log_type', 'srs')

  if (sprintId) {
    query = query.eq('sprint_id', sprintId)
  }

  const { data: logs, error: logsError } = await query
  if (logsError)
    throw new Error(`Falha ao buscar revisões: ${logsError.message}`)
  if (logs.length === 0) return []

  const taskIds = Array.from(new Set(logs.map((l) => l.task_id)))
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id, epic_id')
    .in('id', taskIds)
  if (tasksError)
    throw new Error(`Falha ao buscar tasks: ${tasksError.message}`)

  const { data: epics, error: epicsError } = await supabase
    .from('epics')
    .select('id, name, color')
  if (epicsError)
    throw new Error(`Falha ao buscar épicos: ${epicsError.message}`)

  const epicIdByTask = new Map(tasks.map((t) => [t.id, t.epic_id]))
  const epicById = new Map(epics.map((e) => [e.id, e]))

  const counts = new Map<string, ReviewsByEpicItem>()
  for (const log of logs) {
    const epicId = epicIdByTask.get(log.task_id)
    const epic = epicId ? epicById.get(epicId) : undefined
    const key = epic?.name ?? 'Sem épico'
    const item = counts.get(key) ?? {
      epicName: key,
      count: 0,
      color: epic?.color ?? null,
    }
    item.count += 1
    counts.set(key, item)
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count)
}
