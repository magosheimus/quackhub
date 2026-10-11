import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ChartCard } from './ChartCard'
import { SectionTitle } from '@/components/ui/section-title'
import { SegmentedProgress } from '@/components/ui/segmented-progress'
import type {
  CompletionByProjectItem,
  CompletionRateOverTimeItem,
} from '@/features/analytics/api/analytics'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { EmptyMessage } from '@/components/ui/empty-message'

type GeneralSectionProps = {
  isAll: boolean
  projects: CompletionByProjectItem[]
  statusCounts: { name: string; count: number }[]
  completionRateOverTime: CompletionRateOverTimeItem[]
}

export function GeneralSection({
  isAll,
  projects,
  statusCounts,
  completionRateOverTime,
}: GeneralSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>{ANALYTICS_TEXTS.general}</SectionTitle>

      <ChartCard title={ANALYTICS_TEXTS.doneByProject}>
        {projects.length > 0 ? (
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const percent =
                project.total > 0
                  ? Math.round((project.completed / project.total) * 100)
                  : 0
              return (
                <div
                  key={project.projectName}
                  className="flex items-center gap-4"
                >
                  <span className="w-48 shrink-0 truncate text-sm text-fg">
                    {project.projectName}
                  </span>
                  <SegmentedProgress
                    value={percent}
                    label={COMMON_TEXTS.progressOf(project.projectName)}
                  />
                  <span className="text-caption">
                    {project.completed} de {project.total}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyMessage>{ANALYTICS_TEXTS.noCards}</EmptyMessage>
        )}
      </ChartCard>

      {!isAll && (
        <ChartCard title={ANALYTICS_TEXTS.cardsByStatus}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {statusCounts.map((status) => (
              <div
                key={status.name}
                className="flex flex-col gap-1 rounded-md border border-border bg-page p-4"
              >
                <span className="glow-heading font-heading text-3xl text-fg">
                  {status.count}
                </span>
                <span className="text-caption">{status.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {isAll && (
        <ChartCard title={ANALYTICS_TEXTS.completionBySprint}>
          {completionRateOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={completionRateOverTime}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="sprintName"
                  tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--signal-success)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--signal-success)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyMessage>{SPRINTS_TEXTS.noClosedSprints}</EmptyMessage>
          )}
        </ChartCard>
      )}
    </section>
  )
}
