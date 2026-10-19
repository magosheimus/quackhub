import { Button } from '@/components/ui/button'
import { LoadingText } from '@/components/feedback/loading-text'
import { EmptyMessage } from '@/components/feedback/empty-message'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-fg">{PERSONAS_TEXTS.description}</span>
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startAdding}
            className="gap-2"
          >
            <IconUserPlus size={18} aria-hidden="true" className="size-4.5" />
            {PERSONAS_TEXTS.newPersona}
          </Button>
        )}
      </div>
      {isAdding && <PersonaEditor persona={null} onDone={stopEditing} />}
      {isLoading && <LoadingText />}
      {showEmpty && <EmptyMessage>{PERSONAS_TEXTS.empty}</EmptyMessage>}

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) =>
          isEditing(persona.id) ? (
            <li key={persona.id} className="col-span-full">
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
    <li className="flex items-center gap-2 rounded-md border border-border p-1 pr-2">
      <button
        type="button"
        onClick={onEdit}
        aria-label={PERSONAS_TEXTS.edit(persona.name)}
        title={PERSONAS_TEXTS.edit(persona.name)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-sm p-1 text-left hover:bg-hover"
      >
        <PersonaAvatar icon={iconKey} name={persona.name} size="md" />
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
