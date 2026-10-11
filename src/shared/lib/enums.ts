import { Constants } from '@/shared/types/database.types'

const DB_ENUMS = Constants.public.Enums

export const TASK_STATUSES = DB_ENUMS.task_status
export const TASK_PRIORITIES = DB_ENUMS.task_priority
export const PROJECT_TYPES = DB_ENUMS.project_type
export const RECURRENCE_TYPES = DB_ENUMS.recurrence_type

export function createEnumGuard<T extends string>(values: readonly T[]) {
  return (value: unknown): value is T =>
    typeof value === 'string' && (values as readonly string[]).includes(value)
}

export const isTaskStatus = createEnumGuard(TASK_STATUSES)
export const isTaskPriority = createEnumGuard(TASK_PRIORITIES)
export const isProjectType = createEnumGuard(PROJECT_TYPES)
export const isRecurrenceType = createEnumGuard(RECURRENCE_TYPES)
