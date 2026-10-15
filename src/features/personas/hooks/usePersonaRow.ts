import { useState } from 'react'
import { useDeletePersona } from '@/features/personas/hooks/usePersonaMutations'
import { getPersonaIconKey } from '@/features/personas/lib/persona'
import type { Persona } from '@/shared/types/entities'

export function usePersonaRow(persona: Persona) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { mutate: deletePersona, isPending: isDeleting } = useDeletePersona()

  return {
    iconKey: getPersonaIconKey(persona),
    isConfirmingDelete,
    setIsConfirmingDelete,
    confirmDelete: () => deletePersona(persona.id),
    isDeleting,
  }
}
