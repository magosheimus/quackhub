import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Input } from '@/components/ui/input'
import { Panel } from '@/components/layout/panel'
import { SectionLabel } from '@/components/layout/section-label'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { useCardLinks } from '@/features/tasks/hooks/links/useCardLinks'
import {
  IconClose,
  IconExternalLink,
  IconLink,
  IconPlusBoxSharp,
} from '@/shared/lib/icons'

type CardLinksProps = {
  taskId: string
}

export function CardLinks({ taskId }: CardLinksProps) {
  const {
    rows,
    urlDraft,
    setUrlDraft,
    titleDraft,
    setTitleDraft,
    showInvalid,
    canAdd,
    submit,
    removeLink,
    handleDragEnd,
  } = useCardLinks(taskId)

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel icon={IconLink}>{TASKS_TEXTS.links}</SectionLabel>

      <Panel className="flex flex-col gap-3 p-3">
        <form onSubmit={submit} className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <Input
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              placeholder={TASKS_TEXTS.linkUrlPlaceholder}
              aria-label={TASKS_TEXTS.linkUrlPlaceholder}
              aria-invalid={showInvalid}
              inputMode="url"
              className="min-w-48 flex-2"
            />
            <Input
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              placeholder={TASKS_TEXTS.linkTitlePlaceholder}
              aria-label={TASKS_TEXTS.linkTitlePlaceholder}
              className="min-w-32 flex-1"
            />
            <button
              type="submit"
              disabled={!canAdd}
              aria-label={TASKS_TEXTS.addLink}
              title={TASKS_TEXTS.addLink}
              className="flex size-8 items-center justify-center text-fg-muted hover:text-fg disabled:opacity-50 motion-safe:transition-transform motion-safe:enabled:hover:scale-110"
            >
              <IconPlusBoxSharp size={16} aria-hidden="true" />
            </button>
          </div>
          {showInvalid && (
            <span className="text-caption text-danger">
              {TASKS_TEXTS.invalidLink}
            </span>
          )}
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="card-links">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-1.5 empty:hidden"
              >
                {rows.map(({ link, label, domain }, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(drag) => (
                      <li
                        ref={drag.innerRef}
                        {...drag.draggableProps}
                        {...drag.dragHandleProps}
                        className="flex items-center gap-2 text-body"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={TASKS_TEXTS.openLink(label)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-fg hover:text-accent hover:underline"
                        >
                          <IconExternalLink
                            size={14}
                            aria-hidden="true"
                            className="shrink-0 text-fg-muted"
                          />
                          <span className="truncate">{label}</span>
                          {domain && (
                            <span className="shrink-0 text-caption">
                              {domain}
                            </span>
                          )}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeLink(link.id)}
                          aria-label={TASKS_TEXTS.removeLink(label)}
                          title={TASKS_TEXTS.removeLink(label)}
                        >
                          <IconClose size={12} className="text-fg-muted" />
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </Panel>
    </div>
  )
}
