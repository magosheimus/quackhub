import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useDependencies } from '@/hooks/tasks/dependencies/useDependencies'
import { useAddDependency } from '@/hooks/tasks/dependencies/useAddDependency'
import { useRemoveDependency } from '@/hooks/tasks/dependencies/useRemoveDependency'
import { useSimilarCards } from '@/hooks/tasks/useSimilarCards'
import { useDebouncedValue } from '@/hooks/shared/useDebouncedValue'

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
      <span className="text-sm font-medium text-[--text-primary]">
        Depende de
      </span>

      {dependencies && dependencies.length > 0 && (
        <div className="flex flex-col gap-1">
          {dependencies.map((dep) => (
            <div
              key={dep.id}
              className="flex items-center justify-between gap-2 rounded-(--radius-md) border border-(--border) p-2 text-sm"
            >
              <span
                className={
                  dep.status === 'done'
                    ? 'text-[--text-muted] line-through'
                    : 'text-[--text-primary]'
                }
              >
                {dep.status === 'done' ? '✓' : '○'} {dep.title}
              </span>
              <button
                type="button"
                onClick={() =>
                  removeDependency({ taskId, dependsOnTaskId: dep.id })
                }
                aria-label={`Remover dependência de "${dep.title}"`}
              >
                <X size={14} className="text-[--text-muted]" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar card pra adicionar como dependência..."
        aria-label="Buscar dependência"
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
              className="rounded-(--radius-md) border border-(--border) p-2 text-left text-sm text-[--text-primary]"
            >
              {candidate.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
