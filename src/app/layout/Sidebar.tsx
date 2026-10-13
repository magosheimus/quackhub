import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconBulletlist,
  IconCalendarWeeks,
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
import { useProjectNavItems } from '@/features/projects/hooks/useProjectNavItems'
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
import { LogoMark } from '@/components/ui/logo-mark'
import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DAILY_TRACKER_TEXTS } from '@/features/dailyTracker/constants/texts'

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
  hint,
  children,
}: {
  to: string
  icon: IconComponent
  end?: boolean
  hint?: string
  children: ReactNode
}) {
  const link = (
    <NavLink to={to} end={end} className={navLinkClass}>
      <Icon size={16} aria-hidden="true" />
      {children}
    </NavLink>
  )
  if (!hint) {
    return link
  }
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{hint}</TooltipContent>
    </Tooltip>
  )
}

type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { isLoading, items: projectItems } = useProjectNavItems()
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
    <aside
      className={cn(
        'flex h-full w-55 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface p-4',
        className,
      )}
    >
      <div className="mb-6 px-1">
        <div className="flex items-center gap-3 font-heading text-3xl text-accent">
          <LogoMark />
          <span>{COMMON_TEXTS.brand}</span>
        </div>
      </div>

      <div className="mb-4">
        <GlobalSearch />
      </div>

      <div className="mb-4 [&>button]:h-10 [&>button]:w-full [&>button]:text-sm">
        <CardCreateModal />
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem
          to="/diario"
          icon={IconCalendarWeeks}
          hint={APP_TEXTS.hintDailyTracker}
        >
          {DAILY_TRACKER_TEXTS.title}
        </NavItem>
        <NavItem to="/inbox" icon={IconInbox} hint={APP_TEXTS.hintInbox}>
          {INBOX_TEXTS.title}
          {inboxCount > 0 && (
            <span className="ml-auto text-caption">{inboxCount}</span>
          )}
        </NavItem>
        <NavItem to="/rascunhos" icon={IconNotes} hint={APP_TEXTS.hintDrafts}>
          {DRAFTS_TEXTS.title}
          {draftsCount > 0 && (
            <span className="ml-auto text-caption">{draftsCount}</span>
          )}
        </NavItem>
        <NavItem to="/board" icon={IconGrid} hint={APP_TEXTS.hintCurrentSprint}>
          {COMMON_TEXTS.currentSprint}
        </NavItem>
        <NavItem
          to="/backlog"
          icon={IconBulletlist}
          hint={APP_TEXTS.hintBacklog}
        >
          {COMMON_TEXTS.backlog}
        </NavItem>
        <NavItem to="/sprints" icon={IconClock} hint={APP_TEXTS.hintHistory}>
          {COMMON_TEXTS.history}
        </NavItem>
        <NavItem
          to="/analytics"
          icon={IconChartBar}
          hint={APP_TEXTS.hintAnalytics}
        >
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
            {projectItems.map(({ project, color }) => (
              <Panel key={project.id} className="group flex items-center p-0">
                <NavLink
                  to={`/board?project=${project.id}`}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-sm text-fg"
                >
                  <IconFolder size={12} aria-hidden="true" style={{ color }} />
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
