import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
import { getTasksBySprintId, updateTaskSprint } from '@/services/tasks/tasks'
import { getProjects } from '@/services/projects/projects'
import {
  applyCarryover,
  computeSprintMetrics,
  type CarryoverDecision,
  type SprintMetrics,
} from '@/lib/sprint'

type Sprint = Database['public']['Tables']['sprints']['Row']
type NewSprint = Database['public']['Tables']['sprints']['Insert']
type SprintUpdate = Database['public']['Tables']['sprints']['Update']

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

export async function updateSprint(
  id: string,
  data: SprintUpdate,
): Promise<Sprint> {
  const { data: sprint, error } = await supabase
    .from('sprints')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao atualizar sprint: ${error.message}`)
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
      throw new Error('Já existe uma Sprint ativa (RN-P03)')
    }
    throw new Error(`Falha ao iniciar sprint: ${error.message}`)
  }
  return data
}

export async function setSprintClosed(
  id: string,
  metrics: SprintMetrics,
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

export async function getSprintById(id: string): Promise<Sprint> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(`Falha ao buscar sprint: ${error.message}`)
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

  const carryoverResults = applyCarryover(tasks, decisions, nextSprintId)
  await Promise.all(
    carryoverResults.map((result) =>
      updateTaskSprint(result.taskId, result.sprintId),
    ),
  )

  return setSprintClosed(sprintId, metrics)
}
