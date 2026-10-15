import { useState } from 'react'
import { usePersonas } from '@/features/personas/hooks/usePersonas'

const NEW_PERSONA_ID = 'new'

export function usePersonaManager() {
  const { data: personas = [], isLoading } = usePersonas()
  const [editingId, setEditingId] = useState<string | null>(null)
  const isAdding = editingId === NEW_PERSONA_ID

  return {
    personas,
    isLoading,
    showEmpty: !isLoading && personas.length === 0 && !isAdding,
    isAdding,
    isEditing: (id: string) => editingId === id,
    startAdding: () => setEditingId(NEW_PERSONA_ID),
    startEditing: (id: string) => setEditingId(id),
    stopEditing: () => setEditingId(null),
  }
}
