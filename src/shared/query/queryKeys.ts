export const queryKeys = {
  auth: {
    emailLink: (tokenHash: string) =>
      ['auth', 'email-link', tokenHash] as const,
  },
  tasks: {
    root: ['tasks'] as const,
    detail: (taskId: string) => ['tasks', 'detail', taskId] as const,
    backlog: (projectId?: string | null) =>
      ['tasks', 'backlog', projectId ?? 'all'] as const,
    project: (projectId: string | null) =>
      ['tasks', 'project', projectId] as const,
    sprint: (sprintId: string) => ['tasks', 'sprint', sprintId] as const,
    similar: (projectId: string | null, title: string) =>
      ['tasks', 'similar', projectId, title] as const,
  },
  tags: {
    root: ['tags'] as const,
    byProject: (projectId: string | null) => ['tags', projectId] as const,
    byTask: (taskId: string) => ['tags', 'task', taskId] as const,
  },
  taskTags: {
    root: ['task-tags'] as const,
    bulk: (taskIds: string[]) =>
      ['task-tags', 'bulk', [...taskIds].sort().join(',')] as const,
  },
  sprints: {
    root: ['sprints'] as const,
    active: ['sprints', 'active'] as const,
  },
  epics: {
    root: ['epics'] as const,
    all: ['epics', 'all'] as const,
    byProject: (projectId: string) => ['epics', projectId] as const,
  },
  projects: {
    root: ['projects'] as const,
  },
  personas: {
    root: ['personas'] as const,
  },
  drafts: {
    root: ['drafts'] as const,
  },
  inbox: {
    root: ['inbox'] as const,
  },
  search: {
    root: ['search'] as const,
    byQuery: (query: string) => ['search', query] as const,
  },
  activityLog: {
    byTask: (taskId: string) => ['activity-log', taskId] as const,
  },
  srsLogs: {
    byTask: (taskId: string) => ['srs-logs', taskId] as const,
  },
  attachments: {
    byTask: (taskId: string) => ['attachments', taskId] as const,
  },
  checklist: {
    byTask: (taskId: string) => ['checklist', taskId] as const,
  },
  links: {
    byTask: (taskId: string) => ['links', taskId] as const,
  },
  dependencies: {
    byTask: (taskId: string) => ['dependencies', taskId] as const,
  },
  analytics: {
    root: ['analytics'] as const,
    accuracyOverTime: (sprintId?: string | null) =>
      ['analytics', 'accuracy-over-time', sprintId ?? 'all'] as const,
    completionByProject: (sprintId: string | null) =>
      ['analytics', 'completion-by-project', sprintId] as const,
    completionRateOverTime: (projectId?: string | null) =>
      ['analytics', 'completion-rate-over-time', projectId ?? 'all'] as const,
    confidenceCalibration: (sprintId?: string | null) =>
      ['analytics', 'confidence-calibration', sprintId ?? 'all'] as const,
    confidenceDistribution: (sprintId?: string | null) =>
      ['analytics', 'confidence-distribution', sprintId ?? 'all'] as const,
    reviewsByEpic: (sprintId?: string | null) =>
      ['analytics', 'reviews-by-epic', sprintId ?? 'all'] as const,
    sprintHistory: (projectId?: string | null) =>
      ['analytics', 'sprint-history', projectId ?? 'all'] as const,
    srsByTag: (projectId?: string | null) =>
      ['analytics', 'srs-by-tag', projectId ?? 'all'] as const,
  },
  dailyTracker: {
    root: ['daily-tracker'] as const,
    habits: ['daily-tracker', 'habits'] as const,
    allHabits: ['daily-tracker', 'all-habits'] as const,
    habitLogs: (start: string, end: string) =>
      ['daily-tracker', 'habit-logs', start, end] as const,
    dailyLogs: (start: string, end: string) =>
      ['daily-tracker', 'daily-logs', start, end] as const,
  },
}
