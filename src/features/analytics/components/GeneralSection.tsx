import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ChartCard } from './ChartCard'
import { SectionLabel } from '@/components/layout/section-label'
import { ColorDot } from '@/components/pickers/color-dot'
import type {
  PersonaCompletionItem,
  ProjectCompletionItem,
  StatusCountItem,
} from '@/features/analytics/hooks/useAnalyticsPage'
import { StatusStrip } from './StatusStrip'
import { CompletionRow } from './CompletionRow'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { cn } from '@/shared/lib/utils'
import type { CompletionRateOverTimeItem } from '@/features/analytics/api/analytics'
import { SPRINTS_TEXTS } from '@/features/sprints/constants/texts'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { EmptyMessage } from '@/components/feedback/empty-message'

type GeneralSectionProps = {
  isAll: boolean
  projects: ProjectCompletionItem[]
  personas: PersonaCompletionItem[]
  statusCounts: StatusCountItem[]
  completionRateOverTime: CompletionRateOverTimeItem[]
}

export function GeneralSection({
  isAll,
  projects,
  personas,
  statusCounts,
  completionRateOverTime,
}: GeneralSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      {!isAll && (
        <div className="flex flex-col gap-4">
          <SectionLabel>{ANALYTICS_TEXTS.cardsByStatus}</SectionLabel>
          <StatusStrip items={statusCounts} />
        </div>
      )}

      <div className={cn('grid gap-4', !isAll && 'lg:grid-cols-2')}>
        <ChartCard title={ANALYTICS_TEXTS.doneByProject}>
          {projects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <CompletionRow
                  key={project.projectName}
                  marker={<ColorDot color={project.color} />}
                  name={project.projectName}
                  percent={project.percent}
                  completed={project.completed}
                  total={project.total}
                  color={project.color}
                />
              ))}
            </div>
          ) : (
            <EmptyMessage>{ANALYTICS_TEXTS.noCards}</EmptyMessage>
          )}
        </ChartCard>

        {!isAll && (
          <ChartCard title={ANALYTICS_TEXTS.doneByPersona}>
            {personas.length > 0 ? (
              <div className="flex flex-col gap-4">
                {personas.map((item) => (
                  <CompletionRow
                    key={item.key}
                    marker={
                      item.persona ? (
                        <PersonaIcon
                          icon={item.persona.icon}
                          name={item.persona.name}
                        />
                      ) : null
                    }
                    name={item.persona?.name ?? PERSONAS_TEXTS.noAssignee}
                    percent={item.percent}
                    completed={item.completed}
                    total={item.total}
                  />
                ))}
              </div>
            ) : (
              <EmptyMessage>{ANALYTICS_TEXTS.noCards}</EmptyMessage>
            )}
          </ChartCard>
        )}
      </div>

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
