import { useState } from 'react'
import { Combobox } from '@base-ui/react/combobox'
import { Input } from '@/components/ui/input'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { usePersonaSelect } from '@/features/personas/hooks/usePersonaOptions'
import type { PersonaOption } from '@/features/personas/lib/persona'
import { IconClose } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type AssigneeComboboxProps = {
  value: string | null
  onChange: (personaId: string | null) => void
  labelId?: string
  inline?: boolean
}

export function AssigneeCombobox({
  value,
  onChange,
  labelId,
  inline = false,
}: AssigneeComboboxProps) {
  const { personaOptions, selected } = usePersonaSelect(value)
  const [isEditing, setIsEditing] = useState(false)
  const isStatic = inline && selected !== null && !isEditing

  return (
    <Combobox.Root
      items={personaOptions}
      value={selected}
      onValueChange={(persona: PersonaOption | null) =>
        onChange(persona?.id ?? null)
      }
      itemToStringLabel={(persona: PersonaOption) => persona.name}
      isItemEqualToValue={(item: PersonaOption, current: PersonaOption) =>
        item.id === current.id
      }
    >
      <div className={cn('group relative', inline && selected && '-mx-2.5')}>
        {selected && (
          <span className="pointer-events-none absolute top-1/2 left-2.5 flex -translate-y-1/2 text-fg">
            <PersonaIcon icon={selected.icon} name={selected.name} />
          </span>
        )}
        <Combobox.Input
          aria-labelledby={labelId}
          aria-label={labelId ? undefined : PERSONAS_TEXTS.assignee}
          placeholder={PERSONAS_TEXTS.assigneePlaceholder}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          render={
            <Input
              className={cn(
                'pr-8',
                selected && 'pl-8',
                isStatic && 'input-static cursor-pointer',
              )}
            />
          }
        />
        {selected && (
          <Combobox.Clear
            aria-label={PERSONAS_TEXTS.clearAssignee}
            title={PERSONAS_TEXTS.clearAssignee}
            className={cn(
              'absolute top-1/2 right-2 flex -translate-y-1/2 text-fg-muted hover:text-fg',
              isStatic &&
                'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
            )}
          >
            <IconClose size={14} aria-hidden="true" />
          </Combobox.Clear>
        )}
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="isolate z-50">
          <Combobox.Popup className="max-h-[min(var(--available-height),16rem)] w-(--anchor-width) overflow-y-auto rounded-(--control-radius) border border-(--control-border) bg-surface p-1 text-fg">
            <Combobox.Empty className="px-1.5 py-1 text-caption empty:hidden">
              {PERSONAS_TEXTS.noMatches}
            </Combobox.Empty>
            <Combobox.List>
              {(persona: PersonaOption) => (
                <Combobox.Item
                  key={persona.id}
                  value={persona}
                  className="flex cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-highlighted:bg-(--control-hover) data-selected:text-accent"
                >
                  <PersonaIcon icon={persona.icon} name={persona.name} />
                  {persona.name}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
