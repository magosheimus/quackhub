import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconChevronsVertical } from '@/shared/lib/icons'
import { BOARD_TEXTS } from '@/features/board/constants/texts'
import type {
  QuickFilterKind,
  QuickFilterMenuGroup,
} from '@/features/board/lib/board'

type QuickFilterMenuProps = {
  groups: QuickFilterMenuGroup[]
  onToggle: (kind: QuickFilterKind, id: string) => void
}

export function QuickFilterMenu({ groups, onToggle }: QuickFilterMenuProps) {
  if (groups.length === 0) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={BOARD_TEXTS.customizeQuickFilters}
            title={BOARD_TEXTS.customizeQuickFilters}
            className="ml-auto"
          />
        }
      >
        <IconChevronsVertical size={16} aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex max-h-96 w-64 flex-col gap-3 p-3"
      >
        <span className="text-xs font-medium text-fg">
          {BOARD_TEXTS.customizeQuickFilters}
        </span>
        {groups.map((group) => (
          <div key={group.kind} className="flex flex-col gap-1">
            <span className="text-caption">{group.label}</span>
            {group.items.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-sm hover:bg-hover"
              >
                <Checkbox
                  checked={item.isVisible}
                  onCheckedChange={() => onToggle(group.kind, item.id)}
                />
                <span className="min-w-0 flex-1 truncate text-fg">
                  {item.name}
                </span>
              </label>
            ))}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
