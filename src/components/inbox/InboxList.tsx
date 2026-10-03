import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, FilePlus2 } from 'lucide-react'
import { useInboxItems } from '@/hooks/inbox/useInboxItems'
import { useTriageItem } from '@/hooks/inbox/useTriageItem'
import { CardCreateModal } from '@/components/card/CardCreateModal'
import type { Database } from '@/types/database.types'

type InboxItem = Database['public']['Tables']['inbox_items']['Row']

const CHECKED_KEY = 'quackhub-inbox-checked'

function loadCheckedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(CHECKED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveCheckedIds(ids: Set<string>) {
  try {
    localStorage.setItem(CHECKED_KEY, JSON.stringify([...ids]))
  } catch {
    // ignore
  }
}

export function InboxList() {
  const { data: items, isLoading } = useInboxItems()
  const { mutate: triage } = useTriageItem()
  const [creatingCardFor, setCreatingCardFor] = useState<InboxItem | null>(null)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() =>
    loadCheckedIds(),
  )

  function handleDiscard(item: InboxItem) {
    triage({
      id: item.id,
      decision: { triaged_to: 'discarded', triaged_task_id: null },
    })
  }

  function toggleChecked(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveCheckedIds(next)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="text-sm text-[--text-muted]">[ CARREGANDO........ ]</div>
    )
  }

  if (!items || items.length === 0) {
    return <div className="text-sm text-[--text-muted]">— Nada por aqui. —</div>
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 rounded-[--radius-md] border border-[--border] bg-[var(--bg-card)] p-3 text-sm"
        >
          <Checkbox
            checked={checkedIds.has(item.id)}
            onCheckedChange={() => toggleChecked(item.id)}
            aria-label="Item pendente"
          />
          <span
            className={
              checkedIds.has(item.id)
                ? 'flex-1 text-[--text-muted] line-through'
                : 'flex-1 text-[--text-primary]'
            }
          >
            {item.content}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDiscard(item)}
            aria-label="Descartar"
          >
            <Trash2 size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCreatingCardFor(item)}
            aria-label="Transformar em card"
          >
            <FilePlus2 size={16} />
          </Button>
        </div>
      ))}

      <CardCreateModal
        open={creatingCardFor !== null}
        onOpenChange={(open) => !open && setCreatingCardFor(null)}
        initialTitle={creatingCardFor?.content}
        hideTrigger
        onCreated={(task) => {
          if (!creatingCardFor) return
          triage({
            id: creatingCardFor.id,
            decision: { triaged_to: 'card', triaged_task_id: task.id },
          })
        }}
      />
    </div>
  )
}
