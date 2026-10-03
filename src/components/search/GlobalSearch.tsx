import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/shared/useDebouncedValue'
import { useSearchTasks } from '@/hooks/search/useSearchTasks'
import { useProjects } from '@/hooks/projects/useProjects'
import { useAllEpics } from '@/hooks/epics/useAllEpics'
import { COLUMN_LABELS } from '@/lib/board'
import { LoadingText } from '../ui/loading-text'

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)
  const { data: results, isLoading } = useSearchTasks(debouncedQuery)
  const { data: projects } = useProjects()
  const { data: epics } = useAllEpics()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && !isTyping)
      ) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setQuery('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-(--radius-md) border border-(--border) px-2 py-1.5 text-left text-sm text-[--text-muted]"
      >
        Buscar...
        <span className="text-xs">Ctrl+K</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange} dismissible>
        <DialogContent className="top-20! left-1/2! -translate-x-1/2! translate-y-0! sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buscar</DialogTitle>
          </DialogHeader>
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, descrição ou tag..."
          />
          <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {isLoading && <LoadingText />}
            {!isLoading && debouncedQuery.trim() && results?.length === 0 && (
              <span className="text-sm text-[--text-muted]">
                — nenhum resultado —
              </span>
            )}
            {results?.map((task) => {
              const project = projects?.find((p) => p.id === task.project_id)
              const epic = epics?.find((e) => e.id === task.epic_id)
              return (
                <Link
                  key={task.id}
                  to={`/cards/${task.id}`}
                  onClick={() => handleOpenChange(false)}
                  className="flex flex-col gap-0.5 rounded-(--radius-md) p-2 text-sm hover:bg-(--bg-card-hover)"
                >
                  <span className="text-[--text-primary]">{task.title}</span>
                  <span className="text-xs text-[--text-muted]">
                    {project?.name ?? '—'} ·{' '}
                    {COLUMN_LABELS[task.status] ?? task.status}
                    {epic ? ` · ${epic.name}` : ''}
                  </span>
                </Link>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
