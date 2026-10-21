import { supabase } from '@/shared/api/supabase'
import { UserFacingError } from '@/shared/lib/errors'
import type { Json } from '@/shared/types/database.types'
import {
  getTasksBySprintId,
  updateTaskSprint,
} from '@/features/tasks/api/tasks'
import { getProjects } from '@/features/projects/api/projects'
import {
  applyCarryover,
  computeSprintMetrics,
  type CarryoverDecision,
  type SprintMetrics,
} from '@/features/sprints/lib/sprint'
import {
  getAccuracyOverTime,
  getCompletionByProject,
  getConfidenceDistribution,
} from '@/features/analytics/api/analytics'
import type { NewSprint, Sprint } from '@/shared/types/entities'
import { SPRINT_ERRORS } from '@/features/sprints/constants/texts'

export async function getSprints(): Promise<Sprint[]> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Falha ao buscar sprints: ${error.message}`)
  return data
}

export async function getActiveSprint(): Promise<Sprint | null> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('status', 'active')
    .maybeSingle()
  if (error) throw new Error(`Falha ao buscar sprint ativa: ${error.message}`)
  return data
}

export async function createSprint(data: NewSprint): Promise<Sprint> {
  const { data: sprint, error } = await supabase
    .from('sprints')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(`Falha ao criar sprint: ${error.message}`)
  return sprint
}

export async function activateSprint(id: string): Promise<Sprint> {
  const { data, error } = await supabase
    .from('sprints')
    .update({ status: 'active' })
    .eq('id', id)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw new UserFacingError(SPRINT_ERRORS.alreadyActive)
    }
    throw new Error(`Falha ao iniciar sprint: ${error.message}`)
  }
  return data
}

async function setSprintClosed(
  id: string,
  metrics: SprintMetrics & {
    carried_to_next: number
    carried_to_backlog: number
    analytics_snapshot: Json
  },
): Promise<Sprint> {
  const { data, error } = await supabase
    .from('sprints')
    .update({ ...metrics, status: 'closed' })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao encerrar sprint: ${error.message}`)
  return data
}

export async function closeSprint(
  sprintId: string,
  decisions: Record<string, CarryoverDecision>,
  nextSprintId: string | null,
): Promise<Sprint> {
  const [tasks, projects] = await Promise.all([
    getTasksBySprintId(sprintId),
    getProjects(),
  ])

  const projectNameById = new Map(projects.map((p) => [p.id, p.name]))
  const metrics = computeSprintMetrics(tasks, projectNameById)

  const [confidence, accuracy, completionByProject] = await Promise.all([
    getConfidenceDistribution(sprintId),
    getAccuracyOverTime(sprintId),
    getCompletionByProject(sprintId),
  ])

  const carryoverResults = applyCarryover(tasks, decisions, nextSprintId)
  await Promise.all(
    carryoverResults.map((result) =>
      updateTaskSprint(result.taskId, result.sprintId),
    ),
  )

  const carriedToNext = carryoverResults.filter(
    (result) => result.sprintId !== null,
  ).length
  const carriedToBacklog = carryoverResults.filter(
    (result) => result.sprintId === null,
  ).length

  return setSprintClosed(sprintId, {
    ...metrics,
    carried_to_next: carriedToNext,
    carried_to_backlog: carriedToBacklog,
    analytics_snapshot: { confidence, accuracy, completionByProject },
  })
}
