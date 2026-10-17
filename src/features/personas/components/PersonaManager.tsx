import { Button } from '@/components/ui/button'
import { LoadingText } from '@/components/ui/loading-text'
import { EmptyMessage } from '@/components/ui/empty-message'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { IconUserMinus, IconUserPlus } from '@/shared/lib/icons'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'
import { PersonaAvatar } from '@/features/personas/components/PersonaAvatar'
import { PersonaEditor } from '@/features/personas/components/PersonaEditor'
import { usePersonaManager } from '@/features/personas/hooks/usePersonaManager'
import { usePersonaRow } from '@/features/personas/hooks/usePersonaRow'
import type { Persona } from '@/features/personas/model/persona'

export function PersonaManager() {
  const {
    personas,
    isLoading,
    showEmpty,
    isAdding,
    isEditing,
    startAdding,
    startEditing,
    stopEditing,
  } = usePersonaManager()

  return (
    <div className="flex flex-col gap-3">
      <span className="text-caption">{PERSONAS_TEXTS.description}</span>
      {isLoading && <LoadingText />}
      {showEmpty && <EmptyMessage>{PERSONAS_TEXTS.empty}</EmptyMessage>}

      <ul className="flex flex-col gap-1">
        {personas.map((persona) =>
          isEditing(persona.id) ? (
            <li key={persona.id}>
              <PersonaEditor persona={persona} onDone={stopEditing} />
            </li>
          ) : (
            <PersonaRow
              key={persona.id}
              persona={persona}
              onEdit={() => startEditing(persona.id)}
            />
          ),
        )}
      </ul>

      {isAdding ? (
        <PersonaEditor persona={null} onDone={stopEditing} />
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={startAdding}
          className="-ml-2.5 gap-2 self-start"
        >
          <IconUserPlus size={18} aria-hidden="true" className="size-4.5" />
          {PERSONAS_TEXTS.newPersona}
        </Button>
      )}
    </div>
  )
}

type PersonaRowProps = {
  persona: Persona
  onEdit: () => void
}

function PersonaRow({ persona, onEdit }: PersonaRowProps) {
  const {
    iconKey,
    isConfirmingDelete,
    setIsConfirmingDelete,
    confirmDelete,
    isDeleting,
  } = usePersonaRow(persona)

  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        aria-label={PERSONAS_TEXTS.edit(persona.name)}
        title={PERSONAS_TEXTS.edit(persona.name)}
        className="-ml-1 flex min-w-0 flex-1 items-center gap-3 rounded-sm p-1 text-left hover:bg-hover"
      >
        <PersonaAvatar icon={iconKey} name={persona.name} size="sm" />
        <span className="min-w-0 flex-1 truncate text-sm text-fg">
          {persona.name}
        </span>
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsConfirmingDelete(true)}
        disabled={isDeleting}
        aria-label={PERSONAS_TEXTS.delete(persona.name)}
        title={PERSONAS_TEXTS.delete(persona.name)}
      >
        <IconUserMinus size={14} aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title={PERSONAS_TEXTS.deleteTitle}
        description={PERSONAS_TEXTS.confirmDelete(persona.name)}
        confirmLabel={PERSONAS_TEXTS.deleteConfirm}
        onConfirm={confirmDelete}
      />
    </li>
  )
}
