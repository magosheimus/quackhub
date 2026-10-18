import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { IconClose } from '@/shared/lib/icons'
import { useSimilarCards } from '@/features/tasks/hooks/useSimilarCards'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import type { Task } from '@/features/tasks/model/task'

const MIN_SEARCH_LENGTH = 3
const MAX_CANDIDATES = 5

type DependencyPickerProps = {
  projectId: string | null
  dependencies: Task[]
  excludeTaskId?: string
  onAdd: (task: Task) => void
  onRemove: (task: Task) => void
}

export function DependencyPicker({
  projectId,
  dependencies,
  excludeTaskId,
  onAdd,
  onRemove,
}: DependencyPickerProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const { data: candidates } = useSimilarCards(debouncedSearch, projectId)

  const dependencyIds = new Set(dependencies.map((dep) => dep.id))
  const visibleCandidates = (candidates ?? [])
    .filter(
      (candidate) =>
        candidate.id !== excludeTaskId && !dependencyIds.has(candidate.id),
    )
    .slice(0, MAX_CANDIDATES)

  return (
    <div className="flex flex-col gap-2">
      {dependencies.length > 0 && (
        <div className="flex flex-col gap-1">
          {dependencies.map((dep) => (
            <div
              key={dep.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border p-2 text-sm"
            >
              <span
                className={
                  dep.status === 'done'
                    ? 'text-fg-muted line-through'
                    : 'text-fg'
                }
              >
                {dep.status === 'done' ? '✓' : '○'} {dep.title}
              </span>
              <button
                type="button"
                onClick={() => onRemove(dep)}
                aria-label={TASKS_TEXTS.removeDependency(dep.title)}
              >
                <IconClose size={12} className="text-fg-muted" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={TASKS_TEXTS.dependencyPlaceholder}
        aria-label={TASKS_TEXTS.dependencySearch}
        disabled={!projectId}
      />

      {search.trim().length >= MIN_SEARCH_LENGTH &&
        visibleCandidates.length > 0 && (
          <div className="flex flex-col gap-1">
            {visibleCandidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => {
                  onAdd(candidate)
                  setSearch('')
                }}
                className="rounded-md border border-border p-2 text-left text-sm text-fg"
              >
                {candidate.title}
              </button>
            ))}
          </div>
        )}
    </div>
  )
}
