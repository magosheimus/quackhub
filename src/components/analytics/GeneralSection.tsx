import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ChartCard, SectionTitle } from './ChartCard'
import { SegmentedProgress } from '@/components/ui/segmented-progress'
import type {
  CompletionByProjectItem,
  CompletionRateOverTimeItem,
} from '@/services/analytics/analytics'

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
      <SectionTitle>Geral</SectionTitle>

      <ChartCard title="CARDS CONCLUÍDOS POR PROJETO">
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
                  <span className="w-48 shrink-0 truncate text-sm text-(--text-primary)">
                    {project.projectName}
                  </span>
                  <SegmentedProgress
                    value={percent}
                    label={`Progresso de ${project.projectName}`}
                  />
                  <span className="text-xs text-(--text-muted)">
                    {project.completed} de {project.total}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-sm text-(--text-muted)">
            — nenhum card nesta sprint —
          </div>
        )}
      </ChartCard>

      {!isAll && (
        <ChartCard title="CARDS POR STATUS">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {statusCounts.map((status) => (
              <div
                key={status.name}
                className="flex flex-col gap-1 rounded-md border border-border bg-(--bg-page) p-4"
              >
                <span className="glow-heading font-heading text-3xl text-(--text-primary)">
                  {status.count}
                </span>
                <span className="text-xs text-(--text-muted)">
                  {status.name}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {isAll && (
        <ChartCard title="TAXA DE CONCLUSÃO POR SPRINT">
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
            <div className="text-sm text-(--text-muted)">
              — nenhuma sprint encerrada ainda —
            </div>
          )}
        </ChartCard>
      )}
    </section>
  )
}
