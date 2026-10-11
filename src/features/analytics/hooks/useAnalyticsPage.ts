import { useSearchParams } from 'react-router-dom'
import { useActiveSprint } from '@/features/sprints/hooks/useActiveSprint'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { useTasksBySprintId } from '@/features/tasks/hooks/sprint/useTasksBySprintId'
import { useAccuracyOverTime } from '@/features/analytics/hooks/useAccuracyOverTime'
import { useCompletionByProject } from '@/features/analytics/hooks/useCompletionByProject'
import { useCompletionRateOverTime } from '@/features/analytics/hooks/useCompletionRateOverTime'
import { useReviewsByEpic } from '@/features/analytics/hooks/useReviewsByEpic'
import { useConfidenceCalibration } from '@/features/analytics/hooks/useConfidenceCalibration'
import {
  ALL_SCOPE,
  CURRENT_SCOPE,
  countTasksByStatus,
  getAccuracyPercent,
  resolveLiveSprintId,
  sumCounts,
  toAccuracyChartData,
} from '@/features/analytics/lib/analytics'
import type { CompletionByProjectItem } from '@/features/analytics/api/analytics'
import { getClosedSprintsByRecency } from '@/features/sprints/lib/sprint'
import { ALL_COLUMNS } from '@/features/board/lib/board'
import { getStatusLabel } from '@/features/tasks/lib/taskStatus'
import type { Sprint } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'

type SprintSnapshot = {
  completionByProject: CompletionByProjectItem[]
}

function getScopeLabel(
  scope: string,
  activeSprint: Sprint | null,
  selectedSprint: Sprint | null,
): string {
  if (scope === CURRENT_SCOPE) {
    return activeSprint
      ? ANALYTICS_TEXTS.currentSprintNamed(activeSprint.name)
      : COMMON_TEXTS.currentSprint
  }
  if (scope === ALL_SCOPE) {
    return COMMON_TEXTS.allProjects
  }
  return selectedSprint?.name ?? ANALYTICS_TEXTS.sprint
}

export function useAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const scope = searchParams.get('sprint') ?? CURRENT_SCOPE

  const { data: activeSprint } = useActiveSprint()
  const { data: sprints } = useSprints()

  const selectedSprint = sprints?.find((s) => s.id === scope) ?? null
  const liveSprintId = resolveLiveSprintId(scope, activeSprint?.id ?? null)
  const snapshot =
    selectedSprint?.status === 'closed'
      ? (selectedSprint.analytics_snapshot as unknown as SprintSnapshot | null)
      : null

  const { data: tasks } = useTasksBySprintId(liveSprintId ?? '')
  const { data: calibration } = useConfidenceCalibration(liveSprintId)
  const { data: accuracyOverTime } = useAccuracyOverTime(liveSprintId)
  const { data: reviewsByEpic } = useReviewsByEpic(liveSprintId)
  const { data: liveByProject } = useCompletionByProject(liveSprintId)
  const { data: completionRateOverTime } = useCompletionRateOverTime(null)

  const accuracy = accuracyOverTime ?? []

  function selectScope(value: string) {
    if (value === CURRENT_SCOPE) {
      setSearchParams({})
    } else {
      setSearchParams({ sprint: value })
    }
  }

  return {
    scope,
    isAllScope: scope === ALL_SCOPE,
    scopeLabel: getScopeLabel(scope, activeSprint ?? null, selectedSprint),
    closedSprints: getClosedSprintsByRecency(sprints ?? []),
    selectScope,
    hasNoActiveSprint: scope === CURRENT_SCOPE && !activeSprint,
    projectCompletion: snapshot?.completionByProject ?? liveByProject ?? [],
    statusCounts: countTasksByStatus(tasks ?? [], ALL_COLUMNS).map(
      ({ status, count }) => ({ name: getStatusLabel(status), count }),
    ),
    completionRateOverTime: completionRateOverTime ?? [],
    totalReviews: sumCounts(calibration ?? []),
    accuracyPercent: getAccuracyPercent(accuracy),
    accuracyChartData: toAccuracyChartData(accuracy),
    reviewsByEpic: reviewsByEpic ?? [],
  }
}
