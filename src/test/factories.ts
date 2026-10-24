import type { Epic, Habit, Project, Sprint } from '@/shared/types/entities'
import type { Task } from '@/features/tasks/model/task'

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    number: null,
    position: 0,
    title: 'Tarefa',
    description: null,
    status: 'todo',
    priority: 'medium',
    importance: null,
    origin: 'manual',
    projectId: 'project-1',
    epicId: null,
    sprintId: null,
    assigneeId: null,
    estimatedMinutes: null,
    due: null,
    recurrence: null,
    recurrenceParentId: null,
    flag: null,
    srs: null,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    user_id: 'user-1',
    id: 'project-1',
    name: 'Projeto',
    type: 'general',
    color: null,
    prefix: null,
    last_task_number: 0,
    position: 0,
    created_at: '2026-01-01T00:00:00Z',
    deleted_at: null,
    ...overrides,
  }
}

export function makeSprint(overrides: Partial<Sprint> = {}): Sprint {
  return {
    user_id: 'user-1',
    id: 'sprint-1',
    name: 'Sprint 1',
    status: 'planned',
    goal: null,
    start_date: '2026-01-05',
    end_date: '2026-01-11',
    total_tasks: null,
    completed_tasks: null,
    completion_rate: null,
    completion_by_project: null,
    carried_to_next: null,
    carried_to_backlog: null,
    analytics_snapshot: null,
    created_at: '2026-01-01T00:00:00Z',
    deleted_at: null,
    ...overrides,
  }
}

export function makeEpic(overrides: Partial<Epic> = {}): Epic {
  return {
    user_id: 'user-1',
    id: 'epic-1',
    project_id: 'project-1',
    name: 'Épico',
    color: null,
    position: 0,
    created_at: '2026-01-01T00:00:00Z',
    deleted_at: null,
    ...overrides,
  }
}

export function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    weekdays: null,
    icon: 'target',
    duration_minutes: null,
    position: 0,
    id: 'h1',
    user_id: 'user-1',
    name: 'Academia',
    type: 'boolean',
    goal: null,
    active: true,
    created_at: '2026-10-01T00:00:00Z',
    ...overrides,
  }
}
