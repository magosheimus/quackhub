import { IconChartColumnDecreasing } from '@/shared/lib/icons'
import { PageTitle } from '@/components/layout/page-title'
import { AnalyticsScopeSelect } from '@/features/analytics/components/AnalyticsScopeSelect'
import { StudySection } from '@/features/analytics/components/StudySection'
import { GeneralSection } from '@/features/analytics/components/GeneralSection'
import { HabitsSection } from '@/features/analytics/components/HabitsSection'
import { useAnalyticsPage } from '@/features/analytics/hooks/useAnalyticsPage'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { EmptyState } from '@/components/feedback/empty-state'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { SprintCreateModal } from '@/features/sprints/components/SprintCreateModal'
import { COMMON_TEXTS } from '@/shared/constants/texts'

export function AnalyticsPage() {
  const {
    scope,
    isAllScope,
    scopeLabel,
    closedSprints,
    selectScope,
    hasNoActiveSprint,
    projectCompletion,
    statusCounts,
    personaCompletion,
    showStudy,
    completionRateOverTime,
    totalReviews,
    accuracyPercent,
    accuracyChartData,
    reviewsByEpic,
    habitSummary,
    habitTrend,
  } = useAnalyticsPage()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageTitle
          title={ANALYTICS_TEXTS.title}
          icon={IconChartColumnDecreasing}
        />
        <AnalyticsScopeSelect
          scope={scope}
          scopeLabel={scopeLabel}
          closedSprints={closedSprints}
          onChange={selectScope}
        />
      </div>

      {hasNoActiveSprint ? (
        <EmptyState
          icon={IconChartColumnDecreasing}
          title={ANALYTICS_TEXTS.noActiveSprintTitle}
          description={ANALYTICS_TEXTS.noActiveSprintDescription}
        >
          <Button variant="outline" size="sm" render={<Link to="/backlog" />}>
            {COMMON_TEXTS.goToBacklog}
          </Button>
          <SprintCreateModal />
        </EmptyState>
      ) : (
        <>
          <GeneralSection
            isAll={isAllScope}
            projects={projectCompletion}
            personas={personaCompletion}
            statusCounts={statusCounts}
            completionRateOverTime={completionRateOverTime}
          />
          {showStudy && (
            <StudySection
              totalReviews={totalReviews}
              accuracyPercent={accuracyPercent}
              accuracyChartData={accuracyChartData}
              epicData={reviewsByEpic}
            />
          )}
          <HabitsSection
            isAll={isAllScope}
            summary={habitSummary}
            trend={habitTrend}
          />
        </>
      )}
    </div>
  )
}
