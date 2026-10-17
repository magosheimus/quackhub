import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

export function invalidateTaskQueries(
  queryClient: QueryClient,
  taskId?: string,
) {
  queryClient.invalidateQueries({ queryKey: queryKeys.tasks.root })
  queryClient.invalidateQueries({ queryKey: queryKeys.inbox.root })
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics.root })
  queryClient.invalidateQueries({ queryKey: queryKeys.search.root })
  if (taskId) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.activityLog.byTask(taskId),
    })
  }
}

export function invalidateTagQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.tags.root })
  queryClient.invalidateQueries({ queryKey: queryKeys.taskTags.root })
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics.root })
}

export function invalidateDailyTrackerQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.dailyTracker.root })
}

export function invalidatePersonaQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.personas.root })
}

// Rascunhos também aparecem na busca global
export function invalidateDraftQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.drafts.root })
  queryClient.invalidateQueries({ queryKey: queryKeys.search.root })
}
