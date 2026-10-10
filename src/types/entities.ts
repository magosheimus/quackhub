import type { Tables, TablesInsert, TablesUpdate } from './database.types'

export type Task = Tables<'tasks'>
export type NewTask = TablesInsert<'tasks'>
export type TaskUpdate = TablesUpdate<'tasks'>

export type Sprint = Tables<'sprints'>
export type NewSprint = TablesInsert<'sprints'>
export type SprintUpdate = TablesUpdate<'sprints'>

export type Project = Tables<'projects'>
export type NewProject = TablesInsert<'projects'>
export type ProjectUpdate = TablesUpdate<'projects'>

export type Epic = Tables<'epics'>
export type NewEpic = TablesInsert<'epics'>
export type EpicUpdate = TablesUpdate<'epics'>

export type ChecklistItem = Tables<'task_checklist_items'>
export type NewChecklistItem = TablesInsert<'task_checklist_items'>
export type ChecklistItemUpdate = TablesUpdate<'task_checklist_items'>

export type DraftsItem = Tables<'drafts_items'>
export type SrsLog = Tables<'srs_logs'>
export type ActivityLog = Tables<'task_activity_log'>
export type Attachment = Tables<'task_attachments'>
export type TimeEntry = Tables<'time_entries'>
