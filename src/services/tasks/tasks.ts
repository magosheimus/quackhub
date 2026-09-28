import { supabase } from '@/lib/supabase'
import type { TaskStatus } from '@/lib/board'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type NewTask = Database['public']['Tables']['tasks']['Insert']

type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export async function createTask(data: NewTask): Promise<Task> {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(`Falha ao criar card: ${error.message}`)
  return task
}

export async function updateTask(id: string, data: TaskUpdate): Promise<Task> {
  const { data: task, error } = await supabase
    .from('tasks')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao atualizar card: ${error.message}`)
  return task
}

export async function addTaskToSprint(
  id: string,
  sprintId: string,
  status: TaskStatus,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ sprint_id: sprintId, status })
    .eq('id', id)
    .select()
    .single()
  if (error)
    throw new Error(`Falha ao adicionar task à sprint: ${error.message}`)
  return data
}

export async function updateTaskSprint(
  id: string,
  sprintId: string | null,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ sprint_id: sprintId })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Falha ao mover task: ${error.message}`)
  return data
}

export async function getTasksBySprintId(sprintId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('sprint_id', sprintId)
    .is('deleted_at', null)
  if (error)
    throw new Error(`Falha ao buscar tasks da sprint: ${error.message}`)
  return data
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<Task> {
  if (status === 'done') {
    const incomplete = await getIncompleteDependencies(id)
    if (incomplete.length > 0) {
      throw new Error(
        `Não é possível concluir — ${incomplete.length} dependência(s) pendente(s): ${incomplete
          .map((t) => t.title)
          .join(', ')}`,
      )
    }
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error)
    throw new Error(`Falha ao atualizar status da task: ${error.message}`)
  return task
}

export async function searchSimilarCards(
  title: string,
  projectId: string,
): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .ilike('title', `%${title}%`)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error)
    throw new Error(`Falha ao buscar cards similares: ${error.message}`)
  return data
}

export async function getBacklogTasks(
  projectId?: string | null,
): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('*')
    .is('sprint_id', null)
    .is('deleted_at', null)

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query.order('updated_at', { ascending: false })
  if (error) throw new Error(`Falha ao buscar backlog: ${error.message}`)
  return data
}

export async function getTagsByProject(projectId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('task_tags')
    .select('tag_name, tasks!inner(project_id)')
    .eq('tasks.project_id', projectId)
  if (error) throw new Error(`Falha ao buscar tags: ${error.message}`)
  return Array.from(new Set(data.map((row) => row.tag_name)))
}

export async function createTaskTags(
  taskId: string,
  tagNames: string[],
): Promise<void> {
  if (tagNames.length === 0) return
  const { error } = await supabase
    .from('task_tags')
    .insert(tagNames.map((tag_name) => ({ task_id: taskId, tag_name })))
  if (error) throw new Error(`Falha ao salvar tags: ${error.message}`)
}

export async function createTaskWithTags(
  data: NewTask,
  tagNames: string[],
): Promise<Task> {
  const task = await createTask(data)
  await createTaskTags(task.id, tagNames)
  return task
}

export async function getTaskTags(taskId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('task_tags')
    .select('tag_name')
    .eq('task_id', taskId)
  if (error) throw new Error(`Falha ao buscar tags do card: ${error.message}`)
  return data.map((row) => row.tag_name)
}

export async function addTaskTag(
  taskId: string,
  tagName: string,
): Promise<void> {
  const { error } = await supabase
    .from('task_tags')
    .insert({ task_id: taskId, tag_name: tagName })
  if (error) throw new Error(`Falha ao adicionar tag: ${error.message}`)
}

export async function removeTaskTag(
  taskId: string,
  tagName: string,
): Promise<void> {
  const { error } = await supabase
    .from('task_tags')
    .delete()
    .eq('task_id', taskId)
    .eq('tag_name', tagName)
  if (error) throw new Error(`Falha ao remover tag: ${error.message}`)
}

export async function getDependencies(taskId: string): Promise<Task[]> {
  const { data: deps, error: depsError } = await supabase
    .from('task_dependencies')
    .select('depends_on_task_id')
    .eq('task_id', taskId)
  if (depsError)
    throw new Error(`Falha ao buscar dependências: ${depsError.message}`)
  if (deps.length === 0) return []

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .in(
      'id',
      deps.map((d) => d.depends_on_task_id),
    )
  if (tasksError)
    throw new Error(`Falha ao buscar tasks dependentes: ${tasksError.message}`)
  return tasks
}

export async function getIncompleteDependencies(
  taskId: string,
): Promise<Task[]> {
  const dependencies = await getDependencies(taskId)
  return dependencies.filter((task) => task.status !== 'done')
}

export async function addDependency(
  taskId: string,
  dependsOnTaskId: string,
): Promise<void> {
  const { error } = await supabase
    .from('task_dependencies')
    .insert({ task_id: taskId, depends_on_task_id: dependsOnTaskId })
  if (error) throw new Error(`Falha ao adicionar dependência: ${error.message}`)
}

export async function removeDependency(
  taskId: string,
  dependsOnTaskId: string,
): Promise<void> {
  const { error } = await supabase
    .from('task_dependencies')
    .delete()
    .eq('task_id', taskId)
    .eq('depends_on_task_id', dependsOnTaskId)
  if (error) throw new Error(`Falha ao remover dependência: ${error.message}`)
}

export async function getTaskById(id: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(`Falha ao buscar card: ${error.message}`)
  return data
}
