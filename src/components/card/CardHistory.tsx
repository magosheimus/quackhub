import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSrsLogs } from '@/hooks/srs/useSrsLogs'
import { useAddManualComment } from '@/hooks/srs/useAddManualComment'
import { useActivityLog } from '@/hooks/activityLog/useActivityLog'
import { useSprints } from '@/hooks/sprints/useSprints'
import { COLUMN_LABELS } from '@/lib/board'

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
  const [isOpen, setIsOpen] = useState(false)
  const { data: logs } = useSrsLogs(taskId)
  const { data: activity } = useActivityLog(taskId)
  const { data: sprints } = useSprints()
  const { mutate: addComment, isPending } = useAddManualComment()
  const [draft, setDraft] = useState('')

  function formatSprintValue(value: string | null): string {
    if (!value) return 'Backlog'
    return sprints?.find((s) => s.id === value)?.name ?? value
  }

  function handleAddComment() {
    const trimmed = draft.trim()
    if (!trimmed) return
    addComment({ taskId, comment: trimmed }, { onSuccess: () => setDraft('') })
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-fit items-center gap-1 text-sm font-medium text-[--text-primary]"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        Histórico
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 pl-6">
          <span className="text-xs font-medium text-[--text-muted]">
            Desempenho
          </span>
          {logs && logs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-(--radius-md) border border-(--border) bg-[var(--bg-card)] p-2 text-sm"
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

          <span className="text-xs font-medium text-[--text-muted]">
            Movimentação
          </span>
          {activity && activity.length > 0 ? (
            <div className="flex flex-col gap-2">
              {activity.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-(--radius-md) border border-(--border) bg-[var(--bg-card)] p-2 text-sm"
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
        </div>
      )}
    </div>
  )
}
