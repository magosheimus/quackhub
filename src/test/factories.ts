import type { Epic, Project, Sprint, Task } from '@/shared/types/entities'

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    user_id: 'user-1',
    id: 'task-1',
    project_id: 'project-1',
    epic_id: null,
    sprint_id: null,
    title: 'Tarefa',
    description: null,
    status: 'todo',
    priority: 'medium',
    flagged: false,
    flag_note: null,
    due_date: null,
    recurrence_type: null,
    recurrence_interval: null,
    recurrence_day_of_month: null,
    recurrence_end_date: null,
    recurrence_parent_id: null,
    origin: 'manual',
    interval: null,
    ease_factor: null,
    next_review: null,
    task_number: null,
    estimated_minutes: null,
    updated_at: '2026-01-01T00:00:00Z',
    deleted_at: null,
    created_at: '2026-01-05T00:00:00Z',
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
