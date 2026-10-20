import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { BurnupPoint } from '@/features/analytics/lib/burnup'
import { ANALYTICS_TEXTS } from '@/features/analytics/constants/texts'
import { ChartCard } from './ChartCard'

const AXIS_TICK = { fill: 'var(--text-primary)', fontSize: 11 }

export function BurnupCard({ points }: { points: BurnupPoint[] }) {
  return (
    <ChartCard title={ANALYTICS_TEXTS.burnup}>
      <p className="text-caption">{ANALYTICS_TEXTS.burnupHint}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={points}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            name={ANALYTICS_TEXTS.burnupIdeal}
            type="linear"
            dataKey="ideal"
            stroke="var(--text-muted)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            name={ANALYTICS_TEXTS.burnupDone}
            type="stepAfter"
            dataKey="done"
            stroke="var(--signal-success)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
