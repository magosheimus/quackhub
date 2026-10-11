import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { IconClose } from '@/shared/lib/icons'
import { useDependencies } from '@/features/tasks/hooks/dependencies/useDependencies'
import { useAddDependency } from '@/features/tasks/hooks/dependencies/useAddDependency'
import { useRemoveDependency } from '@/features/tasks/hooks/dependencies/useRemoveDependency'
import { useSimilarCards } from '@/features/tasks/hooks/useSimilarCards'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

type CardDependenciesProps = {
  taskId: string
  projectId: string
}

export function CardDependencies({ taskId, projectId }: CardDependenciesProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: dependencies } = useDependencies(taskId)
  const { data: candidates } = useSimilarCards(debouncedSearch, projectId)
  const { mutate: addDependency } = useAddDependency()
  const { mutate: removeDependency } = useRemoveDependency()

  const dependencyIds = new Set(dependencies?.map((d) => d.id) ?? [])
  const filteredCandidates = (candidates ?? []).filter(
    (c) => c.id !== taskId && !dependencyIds.has(c.id),
  )

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-fg">
        {TASKS_TEXTS.dependsOn}
      </span>

      {dependencies && dependencies.length > 0 && (
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
                onClick={() =>
                  removeDependency({ taskId, dependsOnTaskId: dep.id })
                }
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
      />

      {search.trim().length >= 3 && filteredCandidates.length > 0 && (
        <div className="flex flex-col gap-1">
          {filteredCandidates.slice(0, 5).map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => {
                addDependency({ taskId, dependsOnTaskId: candidate.id })
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
