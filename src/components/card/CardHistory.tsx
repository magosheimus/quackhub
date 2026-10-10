import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSrsLogs } from '@/hooks/srs/useSrsLogs'
import { useAddManualComment } from '@/hooks/srs/useAddManualComment'
import { useActivityLog } from '@/hooks/activityLog/useActivityLog'
import { useSprints } from '@/hooks/sprints/useSprints'
import { COLUMN_LABELS } from '@/lib/board'

const PAGE_SIZE = 5

type HistoryTab = 'movimentacao' | 'desempenho'

type CardHistoryProps = {
  taskId: string
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
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
    if (!value) return 'Backlog'
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
          className="text-xs text-[--text-muted] underline underline-offset-2 hover:text-[--text-primary]"
          onClick={
            canExpand
              ? () => setVisibleCount((n) => n + PAGE_SIZE)
              : () => setVisibleCount(PAGE_SIZE)
          }
        >
          {canExpand ? 'Mostrar mais' : 'Mostrar menos'}
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
      <span className="text-sm font-medium text-[--text-primary]">
        Histórico
      </span>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={tab === 'movimentacao' ? 'selected' : 'outline'}
          onClick={() => handleTabChange('movimentacao')}
        >
          Movimentação
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === 'desempenho' ? 'selected' : 'outline'}
          onClick={() => handleTabChange('desempenho')}
        >
          Desempenho
        </Button>
      </div>

      {tab === 'movimentacao' && (
        <>
          {visibleActivity.length > 0 ? (
            <div className="flex flex-col gap-2">
              {visibleActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-md border border-border bg-(--bg-card) p-2 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[--text-muted]">
                    <span>{formatDisplayDateTime(entry.created_at)}</span>
                    <span>·</span>
                    <span>
                      {entry.event_type === 'status_change'
                        ? 'Status'
                        : 'Sprint'}
                    </span>
                  </div>
                  <p className="mt-1 text-[--text-primary]">
                    {entry.event_type === 'status_change'
                      ? `${COLUMN_LABELS[entry.old_value ?? ''] ?? entry.old_value} → ${COLUMN_LABELS[entry.new_value ?? ''] ?? entry.new_value}`
                      : `${formatSprintValue(entry.old_value)} → ${formatSprintValue(entry.new_value)}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-[--text-muted]">
              — nenhuma movimentação registrada ainda —
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
                  className="rounded-md border border-border bg-(--bg-card) p-2 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[--text-muted]">
                    <span>{formatDisplayDate(log.session_date)}</span>
                    <span>·</span>
                    <span>{log.log_type === 'srs' ? 'SRS' : 'Manual'}</span>
                    {log.log_type === 'srs' && (
                      <>
                        <span>·</span>
                        <span>Nota {log.nota}</span>
                        <span>·</span>
                        <span>Confiança {log.confianca}</span>
                        <span>·</span>
                        <span>
                          próxima revisão em {log.new_interval} dia(s)
                        </span>
                      </>
                    )}
                  </div>
                  {log.comment && (
                    <p className="mt-1 text-[--text-primary]">{log.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-[--text-muted]">
              — nenhum registro ainda —
            </span>
          )}

          {renderToggle(totalLogs)}

          <div className="flex flex-col gap-1.5">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Adicionar observação..."
            />
            <Button
              type="button"
              size="sm"
              className="w-fit"
              onClick={handleAddComment}
              disabled={isPending || !draft.trim()}
            >
              Adicionar observação
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
