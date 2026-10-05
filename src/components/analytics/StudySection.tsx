import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ChartCard, SectionTitle } from './ChartCard'
import type { ReviewsByEpicItem } from '@/services/analytics/analytics'

type StudySectionProps = {
  totalReviews: number
  accuracyPercent: number
  accuracyChartData: { week: string; quality: number }[]
  epicData: ReviewsByEpicItem[]
}

export function StudySection({
  totalReviews,
  accuracyPercent,
  accuracyChartData,
  epicData,
}: StudySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Estudo</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 rounded-md border border-border bg-(--bg-card) p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-(--text-primary)">
            Revisões
          </span>
          <span className="glow-heading font-heading text-4xl text-(--text-primary)">
            {totalReviews}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-border bg-(--bg-card) p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-(--text-primary)">
            Taxa de acerto
          </span>
          <span className="glow-heading font-heading text-4xl text-(--text-primary)">
            {accuracyPercent}%
          </span>
        </div>
      </div>

      <ChartCard title="QUALIDADE MÉDIA POR SEMANA">
        {accuracyChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={accuracyChartData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-(--text-muted)">
            — sem dados suficientes —
          </div>
        )}
      </ChartCard>

      <ChartCard title="REVISÕES POR ÉPICO">
        {epicData.length > 0 ? (
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={epicData}
                  dataKey="count"
                  nameKey="epicName"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {epicData.map((epic) => (
                    <Cell
                      key={epic.epicName}
                      fill={epic.color ?? 'var(--border-strong)'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex flex-col gap-2 text-sm text-(--text-primary)">
              {epicData.map((epic) => (
                <li key={epic.epicName} className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ background: epic.color ?? 'var(--border-strong)' }}
                  />
                  {epic.epicName} · {epic.count}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-sm text-(--text-muted)">
            — nenhuma revisão nesta sprint —
          </div>
        )}
      </ChartCard>
    </section>
  )
}
