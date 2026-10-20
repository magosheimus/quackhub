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
  getRelevantStatuses,
  hasStudyContent,
  toStatusShares,
  completionByAssignee,
  type StatusShare,
  resolveLiveSprintId,
  sumCounts,
  toAccuracyChartData,
} from '@/features/analytics/lib/metrics'
import type {
  CompletionByProjectItem,
  ReviewsByEpicItem,
} from '@/features/analytics/api/analytics'
import { getClosedSprintsByRecency } from '@/features/sprints/lib/sprint'
import {
  getStatusLabel,
  STATUS_BADGE_CLASS,
} from '@/features/tasks/lib/taskStatus'
import { isTaskStatus } from '@/shared/lib/enums'
import type { ProjectType, Sprint } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { useAllHabits } from '@/features/dailyTracker/hooks/useHabits'
import { useHabitLogs } from '@/features/dailyTracker/hooks/useHabitLogs'
import { useDailyLogs } from '@/features/dailyTracker/hooks/useDailyLogs'
import { getSprintDays } from '@/features/dailyTracker/lib/dailyTracker'
import {
  buildSprintHabitTrend,
  getEarliestSprintStart,
  summarizeHabitPeriod,
} from '@/features/analytics/lib/habitMetrics'
import { getDateRange, todayLocal } from '@/shared/lib/date'
import {
  buildBurnup,
  lastDoneDateByTask,
} from '@/features/analytics/lib/burnup'
import { useDoneEvents } from '@/features/analytics/hooks/useDoneEvents'
import { NEUTRAL_COLOR, resolvePaletteColor } from '@/shared/lib/palette'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { usePersonaOptions } from '@/features/personas/hooks/usePersonaOptions'
import type { Persona } from '@/features/personas/model/persona'
import { toProjectLabel } from '@/features/projects/lib/project'
import { useDatePreferences } from '@/features/settings/hooks/useDatePreferences'

export type ProjectCompletionItem = CompletionByProjectItem & {
  color: string
  percent: number
}

export type EpicChartItem = Omit<ReviewsByEpicItem, 'color'> & {
  color: string
}

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

export type StatusCountItem = StatusShare & {
  name: string
  colorClass: string
}

const NEUTRAL_STATUS_CLASS = 'bg-fg-muted'
const NO_ASSIGNEE_KEY = 'none'

export type PersonaCompletionItem = {
  key: string
  persona: Persona | null
  completed: number
  total: number
  percent: number
}

export function useAnalyticsPage() {
  const { dateFormat } = useDatePreferences()
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
  const { data: doneEvents } = useDoneEvents(
    liveSprintId,
    (tasks ?? []).map((task) => task.id),
  )
  const liveSprint = sprints?.find((sprint) => sprint.id === liveSprintId)
  const { data: calibration } = useConfidenceCalibration(liveSprintId)
  const { data: accuracyOverTime } = useAccuracyOverTime(liveSprintId)
  const { data: reviewsByEpic } = useReviewsByEpic(liveSprintId)
  const { data: liveByProject } = useCompletionByProject(liveSprintId)
  const { data: completionRateOverTime } = useCompletionRateOverTime(null)

  const accuracy = accuracyOverTime ?? []

  const { data: projects } = useProjects()
  const personas = usePersonaOptions()
  const projectTypeById = new Map<string, ProjectType>(
    (projects ?? []).map((project) => [project.id, project.type]),
  )
  const projectColorByName = new Map(
    (projects ?? []).map((project) => [
      project.name,
      toProjectLabel(project).color,
    ]),
  )

  const today = todayLocal()
  const isAllScope = scope === ALL_SCOPE
  const scopeSprint =
    scope === CURRENT_SCOPE ? (activeSprint ?? null) : selectedSprint
  const scopeDays = scopeSprint ? getSprintDays(scopeSprint, today) : []
  const habitRangeStart = isAllScope
    ? getEarliestSprintStart(sprints ?? [], today)
    : (scopeDays[0] ?? today)
  const habitRangeEnd = isAllScope
    ? today
    : (scopeDays[scopeDays.length - 1] ?? today)
  const { data: habits } = useAllHabits()
  const { data: habitLogs } = useHabitLogs(habitRangeStart, habitRangeEnd)
  const { data: dailyLogs } = useDailyLogs(habitRangeStart, habitRangeEnd)

  function selectScope(value: string) {
    if (value === CURRENT_SCOPE) {
      setSearchParams({})
    } else {
      setSearchParams({ sprint: value })
    }
  }

  return {
    scope,
    isAllScope,
    scopeLabel: getScopeLabel(scope, activeSprint ?? null, selectedSprint),
    closedSprints: getClosedSprintsByRecency(sprints ?? []),
    selectScope,
    hasNoActiveSprint: scope === CURRENT_SCOPE && !activeSprint,
    projectCompletion: (
      snapshot?.completionByProject ??
      liveByProject ??
      []
    ).map((item): ProjectCompletionItem => ({
      ...item,
      color: projectColorByName.get(item.projectName) ?? NEUTRAL_COLOR,
      percent:
        item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
    })),
    statusCounts: toStatusShares(
      countTasksByStatus(
        tasks ?? [],
        getRelevantStatuses(tasks ?? [], projectTypeById),
      ),
    ).map((share): StatusCountItem => ({
      ...share,
      name: getStatusLabel(share.status),
      colorClass: isTaskStatus(share.status)
        ? STATUS_BADGE_CLASS[share.status]
        : NEUTRAL_STATUS_CLASS,
    })),
    burnup:
      liveSprint?.start_date && liveSprint.end_date
        ? buildBurnup({
            days: getDateRange(liveSprint.start_date, liveSprint.end_date),
            tasks: tasks ?? [],
            doneDateByTask: lastDoneDateByTask(doneEvents ?? []),
            today,
            dateFormat,
          })
        : [],
    personaCompletion: completionByAssignee(tasks ?? []).map(
      (item): PersonaCompletionItem => ({
        ...item,
        key: item.assigneeId ?? NO_ASSIGNEE_KEY,
        persona: personas.find((p) => p.id === item.assigneeId) ?? null,
        percent:
          item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
      }),
    ),
    completionRateOverTime: completionRateOverTime ?? [],
    totalReviews: sumCounts(calibration ?? []),
    showStudy: hasStudyContent(
      tasks ?? [],
      projectTypeById,
      sumCounts(calibration ?? []),
      isAllScope,
    ),
    accuracyPercent: getAccuracyPercent(accuracy),
    accuracyChartData: toAccuracyChartData(accuracy),
    reviewsByEpic: (reviewsByEpic ?? []).map((epic): EpicChartItem => ({
      ...epic,
      color: resolvePaletteColor(epic.color, 'var(--border-strong)'),
    })),
    habitSummary: summarizeHabitPeriod(
      habits ?? [],
      habitLogs ?? [],
      dailyLogs ?? [],
      scopeDays,
    ),
    habitTrend: isAllScope
      ? buildSprintHabitTrend(
          sprints ?? [],
          habits ?? [],
          habitLogs ?? [],
          dailyLogs ?? [],
          today,
        )
      : [],
  }
}
