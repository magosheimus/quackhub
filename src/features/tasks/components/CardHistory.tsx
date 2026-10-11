import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSrsLogs } from '@/features/srs/hooks/useSrsLogs'
import { useAddManualComment } from '@/features/srs/hooks/useAddManualComment'
import { useActivityLog } from '@/features/tasks/hooks/activityLog/useActivityLog'
import { useSprints } from '@/features/sprints/hooks/useSprints'
import { getStatusLabel } from '@/features/tasks/lib/taskStatus'
import { formatFullDate } from '@/shared/lib/date'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

const PAGE_SIZE = 5

type HistoryTab = 'movimentacao' | 'desempenho'

type CardHistoryProps = {
  taskId: string
}

function formatDisplayDateTime(isoStr: string | null): string {
  if (!isoStr) return '—'
  const date = new Date(isoStr)
  return date.toLocaleDateString('pt-BR')
}

export function CardHistory({ taskId }: CardHistoryProps) {
  const [tab, setTab] = useState<HistoryTab>('movimentacao')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [draft, setDraft] = useState('')
  const { data: logs } = useSrsLogs(taskId)
  const { data: activity } = useActivityLog(taskId)
  const { data: sprints } = useSprints()
  const { mutate: addComment, isPending } = useAddManualComment()

  function formatSprintValue(value: string | null): string {
    if (!value) return COMMON_TEXTS.backlog
    return sprints?.find((s) => s.id === value)?.name ?? value
  }

  function handleTabChange(next: HistoryTab) {
    setTab(next)
    setVisibleCount(PAGE_SIZE)
  }

  function handleAddComment() {
    const trimmed = draft.trim()
    if (!trimmed) return
    addComment({ taskId, comment: trimmed }, { onSuccess: () => setDraft('') })
  }

  function renderToggle(total: number) {
    const canExpand = total > visibleCount
    if (!canExpand && visibleCount <= PAGE_SIZE) return null

    return (
      <div className="flex justify-center">
        <button
          type="button"
          className="text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
          onClick={
            canExpand
              ? () => setVisibleCount((n) => n + PAGE_SIZE)
              : () => setVisibleCount(PAGE_SIZE)
          }
        >
          {canExpand ? TASKS_TEXTS.showMore : TASKS_TEXTS.showLess}
        </button>
      </div>
    )
  }

  const visibleActivity = activity?.slice(0, visibleCount) ?? []
  const visibleLogs = logs?.slice(0, visibleCount) ?? []
  const totalActivity = activity?.length ?? 0
  const totalLogs = logs?.length ?? 0

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-fg">
        {COMMON_TEXTS.history}
      </span>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={tab === 'movimentacao' ? 'selected' : 'outline'}
          onClick={() => handleTabChange('movimentacao')}
        >
          {TASKS_TEXTS.activityTab}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === 'desempenho' ? 'selected' : 'outline'}
          onClick={() => handleTabChange('desempenho')}
        >
          {TASKS_TEXTS.performanceTab}
        </Button>
      </div>

      {tab === 'movimentacao' && (
        <>
          {visibleActivity.length > 0 ? (
            <div className="flex flex-col gap-2">
              {visibleActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-md border border-border bg-card p-2 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                    <span>{formatDisplayDateTime(entry.created_at)}</span>
                    <span>·</span>
                    <span>
                      {entry.event_type === 'status_change'
                        ? TASKS_TEXTS.statusEvent
                        : TASKS_TEXTS.sprintEvent}
                    </span>
                  </div>
                  <p className="mt-1 text-fg">
                    {entry.event_type === 'status_change'
                      ? `${getStatusLabel(entry.old_value)} → ${getStatusLabel(entry.new_value)}`
                      : `${formatSprintValue(entry.old_value)} → ${formatSprintValue(entry.new_value)}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-fg-muted">
              {TASKS_TEXTS.noActivity}
            </span>
          )}

          {renderToggle(totalActivity)}
        </>
      )}

      {tab === 'desempenho' && (
        <>
          {visibleLogs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {visibleLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-md border border-border bg-card p-2 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                    <span>{formatFullDate(log.session_date)}</span>
                    <span>·</span>
                    <span>
                      {log.log_type === 'srs'
                        ? TASKS_TEXTS.srsLog
                        : TASKS_TEXTS.manualLog}
                    </span>
                    {log.log_type === 'srs' && (
                      <>
                        <span>·</span>
                        <span>{TASKS_TEXTS.logScore(log.nota)}</span>
                        <span>·</span>
                        <span>{TASKS_TEXTS.logConfidence(log.confianca)}</span>
                        <span>·</span>
                        <span>
                          {TASKS_TEXTS.logNextReview(log.new_interval)}
                        </span>
                      </>
                    )}
                  </div>
                  {log.comment && <p className="mt-1 text-fg">{log.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-fg-muted">{TASKS_TEXTS.noLogs}</span>
          )}

          {renderToggle(totalLogs)}

          <div className="flex flex-col gap-1.5">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={TASKS_TEXTS.commentPlaceholder}
            />
            <Button
              type="button"
              size="sm"
              className="w-fit"
              onClick={handleAddComment}
              disabled={isPending || !draft.trim()}
            >
              {TASKS_TEXTS.addComment}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
