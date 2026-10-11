import { IconChartBar } from '@/shared/lib/icons'
import { PageTitle } from '@/components/ui/page-title'
import { AnalyticsScopeSelect } from '@/features/analytics/components/AnalyticsScopeSelect'
import { StudySection } from '@/features/analytics/components/StudySection'
import { GeneralSection } from '@/features/analytics/components/GeneralSection'
import { useAnalyticsPage } from '@/features/analytics/hooks/useAnalyticsPage'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'

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
  } = useAnalyticsPage()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <PageTitle title={ANALYTICS_TEXTS.title} icon={IconChartBar} />
        <AnalyticsScopeSelect
          scope={scope}
          scopeLabel={scopeLabel}
          closedSprints={closedSprints}
          onChange={selectScope}
        />
      </div>

      {hasNoActiveSprint ? (
        <div className="text-sm text-(--text-muted)">
          {ANALYTICS_TEXTS.noActiveSprint}
        </div>
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
        </>
      )}
    </div>
  )
}
