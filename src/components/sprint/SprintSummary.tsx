import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import type { Database } from '@/types/database.types'

type Sprint = Database['public']['Tables']['sprints']['Row']

type ProjectCompletion = {
  project_id: string
  project_name: string
  total: number
  completed: number
  rate: number
}

type SprintSummaryProps = {
  sprint: Sprint
}

export function SprintSummary({ sprint }: SprintSummaryProps) {
  const completionByProject =
    (sprint.completion_by_project as ProjectCompletion[] | null) ?? []

  const chartData = completionByProject.map((p) => ({
    name: p.project_name,
    rate: Math.round(p.rate * 100),
  }))

  return (
    <div className="flex flex-col gap-6 rounded-(--radius-md) border border-(--border) bg-(--bg-card) p-6">
      <div>
        <span className="font-heading text-2xl text-[--text-primary]">
          {sprint.name}
        </span>
        {(sprint.start_date || sprint.end_date) && (
          <div className="text-sm text-[--text-muted]">
            {sprint.start_date ?? '?'} → {sprint.end_date ?? '?'}
          </div>
        )}
        {sprint.goal && (
          <div className="mt-2 text-sm text-[--text-primary]">
            {sprint.goal}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-(--border) pt-4">
        <div>
          <div className="text-xs text-[--text-muted]">ISSUES TOTAL</div>
          <div className="font-heading text-3xl text-[--text-primary]">
            {sprint.total_tasks ?? 0}
          </div>
        </div>
        <div>
          <div className="text-xs text-[--text-muted]">ISSUES CONCLUÍDAS</div>
          <div className="font-heading text-3xl text-[--text-primary]">
            {sprint.completed_tasks ?? 0}
          </div>
        </div>
        <div>
          <div className="text-xs text-[--text-muted]">TAXA DE CONCLUSÃO</div>
          <div className="font-heading text-3xl text-[--text-primary]">
            {Math.round((sprint.completion_rate ?? 0) * 100)}%
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="border-t border-(--border) pt-4">
          <div className="mb-2 text-xs text-[--text-muted]">
            COMPLETION BY PROJECT
          </div>
          <ResponsiveContainer width="100%" height={chartData.length * 40 + 20}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 20, right: 30 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: 'var(--text-primary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="rate" fill="var(--accent)" radius={2}>
                <LabelList
                  dataKey="rate"
                  position="right"
                  formatter={(value) => `${value}%`}
                  fill="var(--text-primary)"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="border-t border-(--border) pt-4">
        <div className="mb-2 text-xs text-[--text-muted]">CARRY-OVER</div>
        <div className="text-sm text-[--text-primary]">
          {sprint.carried_to_next ?? 0} cards → próxima Sprint
        </div>
        <div className="text-sm text-[--text-primary]">
          {sprint.carried_to_backlog ?? 0} cards → Backlog
        </div>
      </div>
    </div>
  )
}
