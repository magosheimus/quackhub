import { useState } from 'react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { STORAGE_KEYS } from '@/shared/constants/storageKeys'

function readStoredProjectId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.draftsProject)
  } catch {
    return null
  }
}

function storeProjectId(projectId: string | null): void {
  try {
    if (projectId) {
      localStorage.setItem(STORAGE_KEYS.draftsProject, projectId)
    } else {
      localStorage.removeItem(STORAGE_KEYS.draftsProject)
    }
  } catch {
    // Sem localStorage a escolha vale só nesta visita
  }
}

export function useDraftCaptureProject() {
  const { data: projects } = useProjects()
  const [storedProjectId, setStoredProjectId] = useState(readStoredProjectId)

  const project = projects?.find((p) => p.id === storedProjectId) ?? null

  function selectProject(projectId: string | null) {
    setStoredProjectId(projectId)
    storeProjectId(projectId)
  }

  return { projects: projects ?? [], project, selectProject }
}
