import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts'
import { useConfidenceDistribution } from '@/hooks/analytics/useConfidenceDistribution'
import { useAccuracyOverTime } from '@/hooks/analytics/useAccuracyOverTime'
import { useCompletionRateOverTime } from '@/hooks/analytics/useCompletionRateOverTime'

export function AnalyticsView() {
  const { data: confidenceDistribution } = useConfidenceDistribution()
  const { data: accuracyOverTime } = useAccuracyOverTime()
  const { data: completionRateOverTime } = useCompletionRateOverTime()

  const totalReviews =
    confidenceDistribution?.reduce((sum, c) => sum + c.count, 0) ?? 0

  const averageAccuracy =
    accuracyOverTime && accuracyOverTime.length > 0
      ? accuracyOverTime.reduce((sum, w) => sum + w.averageQuality, 0) /
        accuracyOverTime.length
      : 0
  const accuracyPercent = Math.round((averageAccuracy / 5) * 100)

  const confidenceChartData =
    confidenceDistribution?.map((c) => ({
      name: String(c.confianca),
      count: c.count,
    })) ?? []

  const accuracyChartData =
    accuracyOverTime?.map((w) => ({
      week: w.week,
      quality: Number(w.averageQuality.toFixed(2)),
    })) ?? []

  const completionChartData = completionRateOverTime ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[--text-muted]">
            REVISÕES REGISTRADAS
          </div>
          <div className="font-heading text-3xl text-[--text-primary]">
            {totalReviews}
          </div>
        </div>
        <div>
          <div className="text-xs text-[--text-muted]">TAXA DE ACERTO</div>
          <div className="font-heading text-3xl text-[--text-primary]">
            {accuracyPercent}%
          </div>
        </div>
      </div>

      <div className="rounded-[--radius-md] border border-[--border] bg-(--bg-card) p-4">
        <div className="mb-2 text-xs text-[--text-muted]">
          DISTRIBUIÇÃO DE CONFIANÇA
        </div>
        {confidenceChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={confidenceChartData}>
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--text-primary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Bar dataKey="count" fill="var(--accent)" radius={2}>
                <LabelList
                  dataKey="count"
                  position="top"
                  fill="var(--text-primary)"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-[--text-muted]">
            — sem revisões registradas ainda —
          </div>
        )}
      </div>

      <div className="rounded-[--radius-md] border border-[--border] bg-(--bg-card) p-4">
        <div className="mb-2 text-xs text-[--text-muted]">
          QUALITY MÉDIO POR SEMANA
        </div>
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
          <div className="text-sm text-[--text-muted]">
            — sem dados suficientes ainda —
          </div>
        )}
      </div>

      <div className="rounded-[--radius-md] border border-[--border] bg-(--bg-card) p-4">
        <div className="mb-2 text-xs text-[--text-muted]">
          TAXA DE CONCLUSÃO POR SPRINT
        </div>
        {completionChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={completionChartData}>
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
          <div className="text-sm text-[--text-muted]">
            — nenhuma sprint encerrada ainda —
          </div>
        )}
      </div>
    </div>
  )
}
