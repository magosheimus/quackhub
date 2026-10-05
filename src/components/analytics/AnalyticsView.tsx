import { IconChartBar } from '@/lib/icons'
import { useSearchParams } from 'react-router-dom'
import { PageTitle } from '@/components/ui/page-title'
import { useActiveSprint } from '@/hooks/sprints/useActiveSprint'
import { useSprints } from '@/hooks/sprints/useSprints'
import { useTasksBySprintId } from '@/hooks/tasks/sprint/useTasksBySprintId'
import { useAccuracyOverTime } from '@/hooks/analytics/useAccuracyOverTime'
import { useCompletionByProject } from '@/hooks/analytics/useCompletionByProject'
import { useCompletionRateOverTime } from '@/hooks/analytics/useCompletionRateOverTime'
import { useReviewsByEpic } from '@/hooks/analytics/useReviewsByEpic'
import { useConfidenceCalibration } from '@/hooks/analytics/useConfidenceCalibration'
import { ALL_COLUMNS, COLUMN_LABELS } from '@/lib/board'
import type { CompletionByProjectItem } from '@/services/analytics/analytics'
import {
  ALL_SCOPE,
  AnalyticsScopeSelect,
  CURRENT_SCOPE,
} from './AnalyticsScopeSelect'
import { StudySection } from './StudySection'
import { GeneralSection } from './GeneralSection'

type SprintSnapshot = {
  completionByProject: CompletionByProjectItem[]
}

export function AnalyticsView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const scope = searchParams.get('sprint') ?? CURRENT_SCOPE
  const isAll = scope === ALL_SCOPE

  const { data: activeSprint } = useActiveSprint()
  const { data: sprints } = useSprints()

  const selectedSprint = sprints?.find((s) => s.id === scope) ?? null
  const liveSprintId =
    scope === CURRENT_SCOPE ? (activeSprint?.id ?? null) : isAll ? null : scope
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

  const closedSprints =
    sprints
      ?.filter((s) => s.status === 'closed')
      .sort((a, b) => (b.end_date ?? '').localeCompare(a.end_date ?? '')) ?? []

  const scopeLabel =
    scope === CURRENT_SCOPE
      ? `Sprint atual${activeSprint ? ` (${activeSprint.name})` : ''}`
      : isAll
        ? 'Todos os projetos'
        : (selectedSprint?.name ?? 'Sprint')

  const noActiveSprint = scope === CURRENT_SCOPE && !activeSprint

  const calibrationData = calibration ?? []
  const totalReviews = calibrationData.reduce((sum, c) => sum + c.count, 0)
  const accuracy = accuracyOverTime ?? []
  const averageAccuracy =
    accuracy.length > 0
      ? accuracy.reduce((sum, w) => sum + w.averageQuality, 0) / accuracy.length
      : 0
  const accuracyPercent = Math.round((averageAccuracy / 5) * 100)
  const byProject = snapshot?.completionByProject ?? liveByProject ?? []
  const statusChartData = ALL_COLUMNS.map((status) => ({
    name: COLUMN_LABELS[status] ?? status,
    count: (tasks ?? []).filter((t) => t.status === status).length,
  }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <PageTitle title="Analytics" icon={IconChartBar} />
        <AnalyticsScopeSelect
          scope={scope}
          scopeLabel={scopeLabel}
          closedSprints={closedSprints}
          onChange={(value) => {
            if (value === CURRENT_SCOPE) setSearchParams({})
            else setSearchParams({ sprint: value })
          }}
        />
      </div>

      {noActiveSprint ? (
        <div className="text-sm text-(--text-muted)">
          — nenhuma sprint ativa para analisar —
        </div>
      ) : (
        <>
          <GeneralSection
            isAll={isAll}
            projects={byProject}
            statusCounts={statusChartData}
            completionRateOverTime={completionRateOverTime ?? []}
          />
          <StudySection
            totalReviews={totalReviews}
            accuracyPercent={accuracyPercent}
            accuracyChartData={accuracy.map((w) => ({
              week: w.week,
              quality: Number(w.averageQuality.toFixed(2)),
            }))}
            epicData={reviewsByEpic ?? []}
          />
        </>
      )}
    </div>
  )
}
