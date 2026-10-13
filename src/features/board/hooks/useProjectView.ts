import { useState } from 'react'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'
import {
  isProjectView,
  type ProjectView,
} from '@/features/board/lib/projectBoard'

const DEFAULT_VIEW: ProjectView = 'progress'

function readStoredView(): ProjectView {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.projectView)
    return isProjectView(stored) ? stored : DEFAULT_VIEW
  } catch {
    return DEFAULT_VIEW
  }
}

export function useProjectView() {
  const [view, setView] = useState<ProjectView>(readStoredView)

  function selectView(next: ProjectView) {
    setView(next)
    try {
      localStorage.setItem(STORAGE_KEYS.projectView, next)
    } catch {
      // Sem localStorage a escolha vale só nesta visita
    }
  }

  return { view, selectView }
}
