import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconBulletlist,
  IconChartColumnDecreasing,
  IconChevronRight,
  IconClock,
  IconFolderFilled,
  IconPencil,
  IconSettings,
} from '@/shared/lib/icons'
import { useProjectNavItems } from '@/features/projects/hooks/useProjectNavItems'
import { getProjectInitial } from '@/features/projects/lib/project'
import { NavItem } from './NavItem'
import { navLinkClass } from './navLinkClass'
import { CartuchoMenu } from './CartuchoMenu'
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH } from './sidebarWidth'
import { ProjectCreateModal } from '@/features/projects/components/ProjectCreateModal'
import { ProjectEditModal } from '@/features/projects/components/ProjectEditModal'
import { LoadingText } from '@/components/feedback/loading-text'
import type { Project } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { APP_TEXTS } from '@/app/constants/texts'
import { Panel } from '@/components/layout/panel'
import { LogoMark } from '@/components/brand/logo-mark'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import { SETTINGS_PATH } from '@/features/settings/constants/paths'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

type SidebarProps = {
  className?: string
  header?: ReactNode
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  className,
  header,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const {
    isLoading,
    items: projectItems,
    handleDragEnd: handleProjectDragEnd,
  } = useProjectNavItems()
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const showProjects = isCollapsed || isProjectsOpen
  const toggleLabel = isCollapsed
    ? APP_TEXTS.expandSidebar
    : APP_TEXTS.collapseSidebar

  return (
    <aside
      className={cn(
        'app-chrome flex h-full shrink-0 flex-col overflow-y-auto border-r-2 border-(--chrome-edge) bg-surface',
        isCollapsed
          ? `${SIDEBAR_COLLAPSED_WIDTH} p-2`
          : `${SIDEBAR_EXPANDED_WIDTH} p-4`,
        className,
      )}
    >
      {onToggleCollapse && (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={toggleLabel}
                aria-expanded={!isCollapsed}
                className={cn(
                  'mb-4 self-center rounded-md text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isCollapsed ? 'p-1.5' : 'p-2',
                )}
              />
            }
          >
            <LogoMark
              size={isCollapsed ? 24 : 64}
              className={isCollapsed ? undefined : 'logo-beacon'}
            />
          </TooltipTrigger>
          <TooltipContent side="right">{toggleLabel}</TooltipContent>
        </Tooltip>
      )}

      {header && <div className="mb-4 flex flex-col gap-4">{header}</div>}

      <nav className="flex flex-col gap-1">
        <NavItem
          to="/backlog"
          icon={IconBulletlist}
          label={COMMON_TEXTS.backlog}
          hint={APP_TEXTS.hintBacklog}
          isCompact={isCollapsed}
        />
        <NavItem
          to="/sprints"
          icon={IconClock}
          label={COMMON_TEXTS.history}
          hint={APP_TEXTS.hintHistory}
          isCompact={isCollapsed}
        />
        <NavItem
          to="/analytics"
          icon={IconChartColumnDecreasing}
          label={APP_TEXTS.analytics}
          hint={APP_TEXTS.hintAnalytics}
          isCompact={isCollapsed}
        />

        {isCollapsed ? (
          <div className="my-1 border-t border-border" />
        ) : (
          <div className={navLinkClass({ isActive: false })}>
            <button
              type="button"
              onClick={() => setIsProjectsOpen((open) => !open)}
              aria-expanded={isProjectsOpen}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <IconChevronRight
                size={16}
                aria-hidden="true"
                className={`transition-transform ${isProjectsOpen ? 'rotate-90' : ''}`}
              />
              {APP_TEXTS.projects}
            </button>
            <ProjectCreateModal />
          </div>
        )}

        {showProjects && (
          <div className="flex flex-col gap-1">
            {isLoading && !isCollapsed && <LoadingText />}
            <DragDropContext onDragEnd={handleProjectDragEnd}>
              <Droppable droppableId="sidebar-projects">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-1"
                  >
                    {projectItems.map(({ project, color }, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(drag) =>
                          isCollapsed ? (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                            >
                              <Tooltip>
                                <TooltipTrigger
                                  render={
                                    <NavLink
                                      to={`/board?project=${project.id}`}
                                      aria-label={project.name}
                                      style={{ color }}
                                      className="flex h-9 items-center justify-center rounded-md border border-border bg-page font-heading text-2xl leading-none text-shadow-none! hover:bg-hover"
                                    />
                                  }
                                >
                                  {getProjectInitial(project.name)}
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  {project.name}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <Panel
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              className="group flex items-center p-0"
                            >
                              <NavLink
                                to={`/board?project=${project.id}`}
                                className="flex flex-1 items-center gap-2 px-3 py-2 text-sm text-fg"
                              >
                                <IconFolderFilled
                                  size={16}
                                  aria-hidden="true"
                                  style={{ color }}
                                />
                                {project.name}
                              </NavLink>
                              <button
                                type="button"
                                onClick={() => setEditingProject(project)}
                                className="p-2 text-fg-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                                aria-label={APP_TEXTS.editProject(project.name)}
                              >
                                <IconPencil size={12} />
                              </button>
                            </Panel>
                          )
                        }
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-4">
        {!isCollapsed && <CartuchoMenu />}
        <NavItem
          to={SETTINGS_PATH}
          icon={IconSettings}
          label={APP_TEXTS.settings}
          hint={APP_TEXTS.hintSettings}
          isCompact={isCollapsed}
        />
      </div>

      <ProjectEditModal
        project={editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      />
    </aside>
  )
}
