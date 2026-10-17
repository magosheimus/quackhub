import { useState } from 'react'
import { useDeletePersona } from '@/features/personas/hooks/usePersonaMutations'
import type { Persona } from '@/features/personas/model/persona'

export function usePersonaRow(persona: Persona) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { mutate: deletePersona, isPending: isDeleting } = useDeletePersona()

  return {
    iconKey: persona.icon,
    isConfirmingDelete,
    setIsConfirmingDelete,
    confirmDelete: () => deletePersona(persona.id),
    isDeleting,
  }
}
