import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useSearchTasks } from '@/features/search/hooks/useSearchTasks'
import { useSearchDrafts } from '@/features/search/hooks/useSearchDrafts'
import { DRAFTS_PATH } from '@/features/drafts/constants/paths'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useAllEpics } from '@/features/epics/hooks/useAllEpics'
import { STATUS_LABELS } from '@/features/tasks/lib/taskStatus'
import { LoadingText } from '@/components/ui/loading-text'
import { SEARCH_TEXTS } from '@/features/search/constants/texts'
import { EmptyMessage } from '@/components/ui/empty-message'
import { IconCardText, IconNotes, type IconComponent } from '@/shared/lib/icons'

const RESULT_CLASS =
  'flex flex-col gap-0.5 rounded-md p-2 text-sm hover:bg-card-hover'

type ResultSectionProps = {
  icon: IconComponent
  title: string
  count: number
  children: ReactNode
}

function ResultSection({
  icon: Icon,
  title,
  count,
  children,
}: ResultSectionProps) {
  return (
    <section className="flex flex-col gap-1">
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-sm bg-accent px-2 py-1 text-on-accent">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <Icon size={16} aria-hidden="true" className="shrink-0" />
          {title}
        </span>
        <span className="text-xs">{count}</span>
      </div>
      {children}
    </section>
  )
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)
  const { data: results, isLoading } = useSearchTasks(debouncedQuery)
  const { data: draftResults = [], isLoading: isLoadingDrafts } =
    useSearchDrafts(debouncedQuery)
  const hasNoResults =
    !isLoading &&
    !isLoadingDrafts &&
    debouncedQuery.trim() !== '' &&
    results?.length === 0 &&
    draftResults.length === 0
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
        className="flex w-full items-center justify-between rounded-md border border-border px-2 py-1.5 text-left text-subtle"
      >
        {SEARCH_TEXTS.trigger}
        <span className="text-xs">{SEARCH_TEXTS.shortcut}</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange} dismissible>
        <DialogContent className="top-20! left-1/2! -translate-x-1/2! translate-y-0! sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{SEARCH_TEXTS.title}</DialogTitle>
          </DialogHeader>
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={SEARCH_TEXTS.placeholder}
          />
          <div className="flex max-h-[calc(100dvh-20rem)] flex-col gap-4 overflow-y-auto">
            {(isLoading || isLoadingDrafts) && <LoadingText />}
            {hasNoResults && (
              <EmptyMessage>{SEARCH_TEXTS.noResults}</EmptyMessage>
            )}
            {results && results.length > 0 && (
              <ResultSection
                icon={IconCardText}
                title={SEARCH_TEXTS.cardsSection}
                count={results.length}
              >
                {results.map((task) => {
                  const project = projects?.find((p) => p.id === task.projectId)
                  const epic = epics?.find((e) => e.id === task.epicId)
                  return (
                    <Link
                      key={task.id}
                      to={`/cards/${task.id}`}
                      onClick={() => handleOpenChange(false)}
                      className={RESULT_CLASS}
                    >
                      <span className="text-fg">{task.title}</span>
                      <span className="text-caption">
                        {project?.name ?? '—'} · {STATUS_LABELS[task.status]}
                        {epic ? ` · ${epic.name}` : ''}
                      </span>
                    </Link>
                  )
                })}
              </ResultSection>
            )}
            {draftResults.length > 0 && (
              <ResultSection
                icon={IconNotes}
                title={SEARCH_TEXTS.draftsSection}
                count={draftResults.length}
              >
                {draftResults.map((draft) => (
                  <Link
                    key={draft.id}
                    to={DRAFTS_PATH}
                    onClick={() => handleOpenChange(false)}
                    className={RESULT_CLASS}
                  >
                    <span className="text-fg">{draft.content}</span>
                    <span className="text-caption">
                      {draft.checked_at
                        ? SEARCH_TEXTS.archivedDraft
                        : SEARCH_TEXTS.pendingDraft}
                    </span>
                  </Link>
                ))}
              </ResultSection>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
