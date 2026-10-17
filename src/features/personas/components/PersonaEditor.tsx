import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PersonaAvatar } from '@/features/personas/components/PersonaAvatar'
import { PersonaIcon } from '@/features/personas/components/PersonaIcon'
import {
  PERSONA_ICON_LABELS,
  PERSONAS_TEXTS,
} from '@/features/personas/constants/texts'
import { usePersonaEditor } from '@/features/personas/hooks/usePersonaEditor'
import { PERSONA_ICON_KEYS } from '@/features/personas/lib/persona'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { cn } from '@/shared/lib/utils'
import type { Persona } from '@/features/personas/model/persona'

type PersonaEditorProps = {
  persona: Persona | null
  onDone: () => void
}

export function PersonaEditor({ persona, onDone }: PersonaEditorProps) {
  const avatarLabelId = useId()
  const {
    name,
    setName,
    icon,
    selectIcon,
    clearIcon,
    hasIcon,
    nameInputRef,
    canSave,
    submitLabel,
    submit,
    cancelOnEscape,
  } = usePersonaEditor(persona, onDone)

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-(--control-radius) border border-border p-3"
    >
      <div className="flex items-center gap-3">
        <PersonaAvatar icon={icon} name={name} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input
            ref={nameInputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={cancelOnEscape}
            placeholder={PERSONAS_TEXTS.namePlaceholder}
            aria-label={PERSONAS_TEXTS.namePlaceholder}
            className="text-sm"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onDone}>
              {COMMON_TEXTS.cancel}
            </Button>
            <Button type="submit" size="sm" disabled={!canSave}>
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span id={avatarLabelId} className="text-caption">
            {PERSONAS_TEXTS.avatarLabel}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={clearIcon}
            disabled={!hasIcon}
          >
            {PERSONAS_TEXTS.noAvatar}
          </Button>
        </div>
        <div
          role="group"
          aria-labelledby={avatarLabelId}
          className="flex flex-wrap gap-1"
        >
          {PERSONA_ICON_KEYS.map((option) => {
            const isSelected = option === icon
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                aria-label={PERSONA_ICON_LABELS[option]}
                title={PERSONA_ICON_LABELS[option]}
                onClick={() => selectIcon(option)}
                className={cn(
                  'flex size-8 items-center justify-center rounded-sm border',
                  isSelected
                    ? 'border-strong bg-selected text-fg'
                    : 'border-transparent text-fg-muted hover:bg-hover hover:text-fg',
                )}
              >
                <PersonaIcon icon={option} name={name} />
              </button>
            )
          })}
        </div>
      </div>
    </form>
  )
}
