import { IconChartBar } from '@/shared/lib/icons'
import { PageTitle } from '@/components/ui/page-title'
import { AnalyticsScopeSelect } from '@/features/analytics/components/AnalyticsScopeSelect'
import { StudySection } from '@/features/analytics/components/StudySection'
import { GeneralSection } from '@/features/analytics/components/GeneralSection'
import { HabitsSection } from '@/features/analytics/components/HabitsSection'
import { useAnalyticsPage } from '@/features/analytics/hooks/useAnalyticsPage'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { EmptyMessage } from '@/components/ui/empty-message'

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
        <PageTitle title={ANALYTICS_TEXTS.title} icon={IconChartBar} />
        <AnalyticsScopeSelect
          scope={scope}
          scopeLabel={scopeLabel}
          closedSprints={closedSprints}
          onChange={selectScope}
        />
      </div>

      {hasNoActiveSprint ? (
        <EmptyMessage>{ANALYTICS_TEXTS.noActiveSprint}</EmptyMessage>
      ) : (
        <>
          <GeneralSection
            isAll={isAllScope}
            projects={projectCompletion}
            statusCounts={statusCounts}
            completionRateOverTime={completionRateOverTime}
          />
          <StudySection
            totalReviews={totalReviews}
            accuracyPercent={accuracyPercent}
            accuracyChartData={accuracyChartData}
            epicData={reviewsByEpic}
          />
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
