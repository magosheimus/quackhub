import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconBulletlist,
  IconChartBar,
  IconChevronRight,
  IconClock,
  IconFolder,
  IconGrid,
  IconInbox,
  IconNotes,
  IconPencil,
  IconSettings,
  type IconComponent,
} from '@/shared/lib/icons'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { useDraftsItems } from '@/features/drafts/hooks/useDraftsItems'
import { ProjectCreateModal } from '@/features/projects/components/ProjectCreateModal'
import { ProjectEditModal } from '@/features/projects/components/ProjectEditModal'
import { CardCreateModal } from '@/features/tasks/components/CardCreateModal'
import { GlobalSearch } from '@/features/search/components/GlobalSearch'
import { LoadingText } from '@/components/ui/loading-text'
import { useInboxItems } from '@/features/inbox/hooks/useInboxItems'
import type { Project } from '@/shared/types/entities'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { APP_TEXTS } from '@/app/constants/texts'
import { INBOX_TEXTS } from '@/features/inbox/constants/texts'
import { DRAFTS_TEXTS } from '@/features/drafts/constants/texts'
import { Panel } from '@/components/ui/panel'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-10 items-center gap-3 border px-3 py-2 rounded-md text-base ${
    isActive
      ? 'border-border bg-selected text-fg'
      : 'border-transparent text-fg hover:bg-hover'
  }`

function NavItem({
  to,
  icon: Icon,
  end,
  children,
}: {
  to: string
  icon: IconComponent
  end?: boolean
  children: ReactNode
}) {
  return (
    <NavLink to={to} end={end} className={navLinkClass}>
      <Icon size={16} aria-hidden="true" />
      {children}
    </NavLink>
  )
}

export function Sidebar() {
  const { data: projects, isLoading } = useProjects()
  const { data: draftsItems } = useDraftsItems()
  const draftsCount = draftsItems?.length ?? 0
  const { data: inboxData } = useInboxItems()
  const inboxCount =
    (inboxData?.urgent.length ?? 0) +
    (inboxData?.srsOverdue.length ?? 0) +
    (inboxData?.dueToday.length ?? 0)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  return (
    <aside className="h-full w-55 shrink-0 overflow-y-auto border-r border-border bg-surface p-4 flex flex-col">
      <div className="mb-6 px-1">
        <div className="glow-heading font-heading text-3xl text-accent">
          {COMMON_TEXTS.brand}
        </div>
        <div className="text-caption">{APP_TEXTS.mascot}</div>
      </div>

      <div className="mb-4">
        <GlobalSearch />
      </div>

      <div className="mb-4 [&>button]:h-10 [&>button]:w-full [&>button]:text-sm">
        <CardCreateModal />
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem to="/inbox" icon={IconInbox}>
          {INBOX_TEXTS.title}
          {inboxCount > 0 && (
            <span className="ml-auto text-caption">{inboxCount}</span>
          )}
        </NavItem>
        <NavItem to="/rascunhos" icon={IconNotes}>
          {DRAFTS_TEXTS.title}
          {draftsCount > 0 && (
            <span className="ml-auto text-caption">{draftsCount}</span>
          )}
        </NavItem>
        <NavItem to="/board" icon={IconGrid}>
          {COMMON_TEXTS.currentSprint}
        </NavItem>
        <NavItem to="/backlog" icon={IconBulletlist}>
          {COMMON_TEXTS.backlog}
        </NavItem>
        <NavItem to="/sprints" icon={IconClock}>
          {COMMON_TEXTS.history}
        </NavItem>
        <NavItem to="/analytics" icon={IconChartBar}>
          {APP_TEXTS.analytics}
        </NavItem>
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

        {isProjectsOpen && (
          <div className="flex flex-col gap-1">
            {isLoading && <LoadingText />}
            {projects?.map((project) => (
              <Panel key={project.id} className="group flex items-center p-0">
                <NavLink
                  to={`/board?project=${project.id}`}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-sm text-fg"
                >
                  <IconFolder size={12} aria-hidden="true" />
                  {project.name}
                </NavLink>
                <button
                  type="button"
                  onClick={() => setEditingProject(project)}
                  className="p-2 text-fg-muted opacity-0 group-hover:opacity-100"
                  aria-label={APP_TEXTS.editProject(project.name)}
                >
                  <IconPencil size={12} />
                </button>
              </Panel>
            ))}
          </div>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-4">
        <NavItem to="/configuracoes" icon={IconSettings}>
          {APP_TEXTS.settings}
        </NavItem>
      </div>

      <ProjectEditModal
        project={editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      />
    </aside>
  )
}
