import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import {
  useCreatePersona,
  useUpdatePersona,
} from '@/features/personas/hooks/usePersonaMutations'
import {
  getPersonaIconKey,
  normalizePersonaName,
  type PersonaIconOption,
} from '@/features/personas/lib/persona'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import type { Persona } from '@/shared/types/entities'

export function usePersonaEditor(persona: Persona | null, onDone: () => void) {
  const [name, setName] = useState(persona?.name ?? '')
  const [icon, setIcon] = useState<PersonaIconOption>(
    persona ? getPersonaIconKey(persona) : null,
  )
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { mutate: createPersona, isPending: isCreating } = useCreatePersona()
  const { mutate: updatePersona, isPending: isUpdating } = useUpdatePersona()
  const normalizedName = normalizePersonaName(name)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!normalizedName) {
      return
    }
    const data = { name: normalizedName, icon }
    if (persona) {
      updatePersona({ id: persona.id, data }, { onSuccess: onDone })
      return
    }
    createPersona(data, { onSuccess: onDone })
  }

  function cancelOnEscape(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      onDone()
    }
  }

  return {
    name,
    setName,
    icon,
    selectIcon: setIcon,
    clearIcon: () => setIcon(null),
    hasIcon: icon !== null,
    nameInputRef,
    canSave: normalizedName !== null && !isCreating && !isUpdating,
    submitLabel: persona ? COMMON_TEXTS.save : COMMON_TEXTS.add,
    submit,
    cancelOnEscape,
  }
}
