import type {
  NewTask,
  Task,
  TaskDue,
  TaskFlag,
  TaskRecurrence,
  TaskSrs,
  TaskUpdate,
} from '@/features/tasks/model/task'
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/shared/types/database.types'

import { toImportance } from '@/features/tasks/lib/importance'

type TaskRow = Tables<'tasks'>

function toDue(row: TaskRow): TaskDue | null {
  return row.due_date ? { date: row.due_date, time: row.due_time } : null
}

function toRecurrence(row: TaskRow): TaskRecurrence | null {
  if (!row.recurrence_type) {
    return null
  }
  const interval = row.recurrence_interval ?? 1
  const endDate = row.recurrence_end_date
  if (row.recurrence_type === 'monthly') {
    return {
      type: 'monthly',
      interval,
      dayOfMonth: row.recurrence_day_of_month,
      endDate,
    }
  }
  return { type: row.recurrence_type, interval, endDate }
}

function toFlag(row: TaskRow): TaskFlag | null {
  return row.flagged ? { note: row.flag_note } : null
}

function toSrs(row: TaskRow): TaskSrs | null {
  if (
    row.next_review === null ||
    row.ease_factor === null ||
    row.interval === null
  ) {
    return null
  }
  return {
    easeFactor: row.ease_factor,
    interval: row.interval,
    nextReview: row.next_review,
  }
}

export function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    number: row.task_number,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    importance: toImportance(row.importance),
    origin: row.origin,
    projectId: row.project_id,
    epicId: row.epic_id,
    sprintId: row.sprint_id,
    assigneeId: row.assignee_id,
    estimatedMinutes: row.estimated_minutes,
    due: toDue(row),
    recurrence: toRecurrence(row),
    recurrenceParentId: row.recurrence_parent_id,
    flag: toFlag(row),
    srs: toSrs(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function dueColumns(due: TaskDue | null) {
  return { due_date: due?.date ?? null, due_time: due?.time ?? null }
}

function recurrenceColumns(recurrence: TaskRecurrence | null) {
  return {
    recurrence_type: recurrence?.type ?? null,
    recurrence_interval: recurrence?.interval ?? null,
    recurrence_day_of_month:
      recurrence?.type === 'monthly' ? recurrence.dayOfMonth : null,
    recurrence_end_date: recurrence?.endDate ?? null,
  }
}

function flagColumns(flag: TaskFlag | null) {
  return { flagged: flag !== null, flag_note: flag?.note ?? null }
}

function srsColumns(srs: TaskSrs | null) {
  return {
    ease_factor: srs?.easeFactor ?? null,
    interval: srs?.interval ?? null,
    next_review: srs?.nextReview ?? null,
  }
}

export function toTaskUpdate(changes: TaskUpdate): TablesUpdate<'tasks'> {
  return {
    title: changes.title,
    description: changes.description,
    status: changes.status,
    priority: changes.priority,
    importance: changes.importance,
    origin: changes.origin,
    project_id: changes.projectId,
    epic_id: changes.epicId,
    sprint_id: changes.sprintId,
    assignee_id: changes.assigneeId,
    estimated_minutes: changes.estimatedMinutes,
    recurrence_parent_id: changes.recurrenceParentId,
    ...(changes.due === undefined ? {} : dueColumns(changes.due)),
    ...(changes.recurrence === undefined
      ? {}
      : recurrenceColumns(changes.recurrence)),
    ...(changes.flag === undefined ? {} : flagColumns(changes.flag)),
    ...(changes.srs === undefined ? {} : srsColumns(changes.srs)),
  }
}

export function toTaskInsert(task: NewTask): TablesInsert<'tasks'> {
  return {
    ...toTaskUpdate(task),
    title: task.title,
    project_id: task.projectId,
  }
}
