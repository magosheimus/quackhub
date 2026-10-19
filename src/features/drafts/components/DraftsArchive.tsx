import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/layout/panel'
import { IconChevronRight, IconToolCase, IconTrash } from '@/shared/lib/icons'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { useDraftsArchive } from '@/features/drafts/hooks/useDraftsArchive'
import type { DraftsItem } from '@/shared/types/entities'
import { cn } from '@/shared/lib/utils'

type DraftsArchiveProps = {
  items: DraftsItem[]
  onRestore: (item: DraftsItem) => void
  onDiscard: (item: DraftsItem) => void
}

export function DraftsArchive({
  items,
  onRestore,
  onDiscard,
}: DraftsArchiveProps) {
  const {
    isOpen,
    toggleOpen,
    groups,
    isGroupOpen,
    toggleGroup,
    hiddenCount,
    showMore,
  } = useDraftsArchive(items)

  if (items.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        className="flex w-fit items-center gap-2 text-base text-fg hover:text-accent"
      >
        <IconChevronRight
          size={12}
          aria-hidden="true"
          className={cn('transition-transform', isOpen && 'rotate-90')}
        />
        <IconToolCase size={16} aria-hidden="true" />
        {DRAFTS_TEXTS.archivedToggle(items.length)}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-4 pl-5">
          {groups.map((group) => {
            const isGroupExpanded = isGroupOpen(group.key)
            return (
              <div key={group.key} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={isGroupExpanded}
                  className="flex w-fit items-center gap-2 text-sm text-fg hover:text-accent"
                >
                  <IconChevronRight
                    size={12}
                    aria-hidden="true"
                    className={cn(
                      'transition-transform',
                      isGroupExpanded && 'rotate-90',
                    )}
                  />
                  {group.label}
                  <span className="text-caption">{group.items.length}</span>
                </button>

                {isGroupExpanded &&
                  group.items.map((item) => (
                    <Panel
                      key={item.id}
                      className="flex items-center gap-3 py-2 text-base"
                    >
                      <Checkbox
                        checked
                        onCheckedChange={() => onRestore(item)}
                        aria-label={DRAFTS_TEXTS.restore(item.content)}
                      />
                      <span className="min-w-0 flex-1 wrap-break-word text-fg-muted line-through">
                        {item.content}
                      </span>
                      <Button
                        type="button"
                        title={DRAFTS_TEXTS.discard}
                        variant="ghost"
                        onClick={() => onDiscard(item)}
                        aria-label={DRAFTS_TEXTS.discard}
                        className="size-8 shrink-0 p-0 hover:bg-surface! hover:text-fg!"
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Panel>
                  ))}
              </div>
            )
          })}

          {hiddenCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={showMore}
              className="self-start"
            >
              {DRAFTS_TEXTS.showMore(hiddenCount)}
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
