import { useState } from 'react'

export function useDayComment(
  savedComment: string,
  onSave: (text: string) => void,
) {
  const [draft, setDraft] = useState(savedComment)
  const [isEditing, setIsEditing] = useState(false)

  function submit() {
    setIsEditing(false)
    onSave(draft)
  }

  return {
    draft,
    setDraft,
    startEditing: () => setIsEditing(true),
    submit,
    isStatic: !isEditing && draft.trim() !== '',
  }
}
