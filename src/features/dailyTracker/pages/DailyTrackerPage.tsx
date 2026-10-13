import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { ErrorState } from '@/components/ui/error-state'
import { LoadingText } from '@/components/ui/loading-text'
import { PageTitle } from '@/components/ui/page-title'
import { Panel } from '@/components/ui/panel'
import { SectionLabel } from '@/components/ui/section-label'
import { HabitHeatmap } from '@/features/dailyTracker/components/HabitHeatmap'
import { HabitManager } from '@/features/dailyTracker/components/HabitManager'
import { TodayHabits } from '@/features/dailyTracker/components/TodayHabits'
import { WellnessLog } from '@/features/dailyTracker/components/WellnessLog'
import { WeeklyStats } from '@/features/dailyTracker/components/WeeklyStats'
import { useDailyTrackerPage } from '@/features/dailyTracker/hooks/useDailyTrackerPage'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'
import {
  IconCalendarWeeks,
  IconChartBar,
  IconChecklist,
  IconSettings,
  type IconComponent,
} from '@/shared/lib/icons'

type SectionPanelProps = {
  icon: IconComponent
  title: string
  aside?: string
  className?: string
  children: ReactNode
}

function SectionPanel({
  icon,
  title,
  aside,
  className,
  children,
}: SectionPanelProps) {
  return (
    <Panel className={cn('flex min-w-0 flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionLabel icon={icon}>{title}</SectionLabel>
        {aside && <span className="text-caption">{aside}</span>}
      </div>
      {children}
    </Panel>
  )
}

export function DailyTrackerPage() {
  const {
    isLoading,
    hasError,
    retry,
    habits,
    hasHabits,
    habitsCount,
    weekdayOrder,
    periodLabel,
    isSprintPeriod,
    pendingToday,
    doneToday,
    todayProgress,
    setTodayValue,
    commitTodayValue,
    toggleToday,
    heatDays,
    heatRows,
    todayMood,
    todayComment,
    saveMood,
    saveComment,
    overallRate,
    todayCount,
    highlights,
    moodHistoryLabel,
    moodDays,
  } = useDailyTrackerPage()

  if (isLoading) {
    return <LoadingText />
  }

  if (hasError) {
    return <ErrorState onRetry={retry} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageTitle title={DAILY_TRACKER_TEXTS.title} icon={IconCalendarWeeks} />
        <span className="text-sm text-fg">{periodLabel}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionPanel
          icon={IconChartBar}
          title={DAILY_TRACKER_TEXTS.summaryTitle(isSprintPeriod)}
        >
          <WeeklyStats
            overallRate={overallRate}
            isSprint={isSprintPeriod}
            todayCount={todayCount}
            highlights={highlights}
          />
        </SectionPanel>
        <WellnessLog
          mood={todayMood}
          comment={todayComment}
          onMoodChange={saveMood}
          onCommentSave={saveComment}
          historyLabel={moodHistoryLabel}
          history={moodDays}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        {hasHabits && (
          <SectionPanel
            icon={IconCalendarWeeks}
            title={DAILY_TRACKER_TEXTS.heatmapTitle(isSprintPeriod)}
            className="max-w-full flex-none"
          >
            <HabitHeatmap days={heatDays} rows={heatRows} />
          </SectionPanel>
        )}
        <SectionPanel
          icon={IconChecklist}
          title={DAILY_TRACKER_TEXTS.todayTitle}
          aside={todayProgress}
          className="flex-1 basis-80"
        >
          <TodayHabits
            hasHabits={hasHabits}
            pending={pendingToday}
            done={doneToday}
            onSetValue={setTodayValue}
            onCommitValue={commitTodayValue}
            onToggle={toggleToday}
          />
        </SectionPanel>
      </div>

      <SectionPanel
        icon={IconSettings}
        title={DAILY_TRACKER_TEXTS.manageHabitsTitle}
        aside={habitsCount}
      >
        <HabitManager habits={habits} weekdayOrder={weekdayOrder} />
      </SectionPanel>
    </div>
  )
}
