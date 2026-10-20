import { ChartCard } from './ChartCard'
import { SegmentedProgress } from '@/components/brand/segmented-progress'
import { EmptyMessage } from '@/components/feedback/empty-message'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { MOOD_LABELS } from '@/features/dailyTracker/constants/texts'
import { HabitIcon } from '@/features/dailyTracker/components/HabitIcon'
import { MOOD_ICONS } from '@/features/dailyTracker/components/moodIcons'
import { MOOD_LEVELS } from '@/features/dailyTracker/lib/dailyTracker'
import type {
  HabitPeriodSummary,
  SprintHabitTrendItem,
} from '@/features/analytics/lib/habitMetrics'

type HabitsSectionProps = {
  isAll: boolean
  summary: HabitPeriodSummary
  trend: SprintHabitTrendItem[]
}

export function HabitsSection({ isAll, summary, trend }: HabitsSectionProps) {
  return (
    <section
      aria-label={ANALYTICS_TEXTS.habitsAndMood}
      className="flex flex-col gap-4"
    >
      {isAll ? (
        <SprintTrend trend={trend} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <HabitGoals summary={summary} />
          <MoodSummaryCard summary={summary} />
        </div>
      )}
    </section>
  )
}

function HabitGoals({ summary }: { summary: HabitPeriodSummary }) {
  return (
    <ChartCard title={ANALYTICS_TEXTS.habitGoals}>
      {summary.habits.length === 0 ? (
        <EmptyMessage>{ANALYTICS_TEXTS.noHabits}</EmptyMessage>
      ) : (
        <>
          <span className="font-heading text-display text-fg">
            {summary.overallRate}%
          </span>
          <div className="flex flex-col gap-2">
            {summary.habits.map((item) => (
              <div
                key={item.habit.id}
                className="grid grid-cols-[minmax(0,1fr)_auto_3rem] items-center gap-3"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <HabitIcon habit={item.habit} />
                  <span className="truncate text-body-strong">
                    {item.habit.name}
                  </span>
                </span>
                <SegmentedProgress
                  value={item.percent}
                  segments={10}
                  label={ANALYTICS_TEXTS.habitsProgress(item.habit.name)}
                />
                <span className="text-right text-caption">
                  {ANALYTICS_TEXTS.habitDays(
                    item.daysCompleted,
                    item.totalDays,
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </ChartCard>
  )
}

function MoodSummaryCard({ summary }: { summary: HabitPeriodSummary }) {
  const { mood } = summary
  const AverageIcon = mood.average ? MOOD_ICONS[mood.average] : null

  return (
    <ChartCard title={ANALYTICS_TEXTS.mood}>
      {mood.total === 0 || !mood.average || !AverageIcon ? (
        <EmptyMessage>{ANALYTICS_TEXTS.noMood}</EmptyMessage>
      ) : (
        <>
          <span className="flex items-center gap-3 font-heading text-heading-2 text-fg">
            <AverageIcon size={48} aria-hidden="true" className="text-accent" />
            {ANALYTICS_TEXTS.moodAverage(MOOD_LABELS[mood.average])}
          </span>
          <div className="flex flex-col gap-2">
            {[...MOOD_LEVELS].reverse().map((level) => {
              const Icon = MOOD_ICONS[level]
              return (
                <div
                  key={level}
                  className="grid grid-cols-[minmax(0,1fr)_auto_2rem] items-center gap-3"
                >
                  <span className="flex items-center gap-2 text-body">
                    <Icon
                      size={16}
                      aria-hidden="true"
                      className="text-fg-muted"
                    />
                    {MOOD_LABELS[level]}
                  </span>
                  <SegmentedProgress
                    value={mood.percents[level]}
                    segments={10}
                    label={ANALYTICS_TEXTS.moodCount(MOOD_LABELS[level])}
                  />
                  <span className="text-right text-caption">
                    {mood.counts[level]}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </ChartCard>
  )
}

function SprintTrend({ trend }: { trend: SprintHabitTrendItem[] }) {
  return (
    <ChartCard title={ANALYTICS_TEXTS.habitsBySprint}>
      {trend.length === 0 ? (
        <EmptyMessage>{ANALYTICS_TEXTS.noHabits}</EmptyMessage>
      ) : (
        <div className="flex flex-col gap-2">
          {trend.map((item) => {
            const Icon = item.averageMood ? MOOD_ICONS[item.averageMood] : null
            return (
              <div
                key={item.sprintId}
                className="grid grid-cols-[minmax(0,1fr)_auto_3rem_1.5rem] items-center gap-3"
              >
                <span className="truncate text-body-strong">{item.name}</span>
                <SegmentedProgress
                  value={item.overallRate}
                  segments={10}
                  label={ANALYTICS_TEXTS.habitsProgress(item.name)}
                />
                <span className="text-right text-caption">
                  {item.overallRate}%
                </span>
                {Icon && item.averageMood ? (
                  <Icon
                    size={16}
                    aria-label={MOOD_LABELS[item.averageMood]}
                    className="text-accent"
                  />
                ) : (
                  <span className="text-center text-fg-muted">·</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </ChartCard>
  )
}
