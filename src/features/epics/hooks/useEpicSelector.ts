import { useEpics } from '@/features/epics/hooks/useEpics'

export const NONE_VALUE = '__none__'
export const NEW_EPIC_VALUE = '__new__'

export function useEpicSelector(
  projectId: string,
  onChange: (epicId: string | null) => void,
  onStartNew: () => void,
) {
  const { data: epics, isLoading } = useEpics(projectId)

  function select(value: string | null) {
    if (value === NEW_EPIC_VALUE) {
      onStartNew()
      return
    }
    onChange(value === NONE_VALUE ? null : value)
  }

  return { epics, isLoading, select }
}
