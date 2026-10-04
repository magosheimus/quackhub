import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Columns3,
  Folder,
  Inbox,
  PenLine,
  List,
  Pencil,
  Settings,
  History,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useProjects } from '@/hooks/projects/useProjects'
import { useDraftsItems } from '@/hooks/drafts/useDraftsItems'
import { ProjectCreateModal } from '@/components/project/ProjectCreateModal'
import { ProjectEditModal } from '@/components/project/ProjectEditModal'
import type { Database } from '@/types/database.types'
import { CardCreateModal } from '@/components/card/CardCreateModal'
import { GlobalSearch } from '../search/GlobalSearch'
import { LoadingText } from '../ui/loading-text'
import { useInboxItems } from '@/hooks/inbox/useInboxItems'

type Project = Database['public']['Tables']['projects']['Row']

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-10 items-center gap-3 border px-3 py-2 rounded-(--radius-md) text-base ${
    isActive
      ? 'border-(--border) bg-(--bg-selected) text-(--text-primary)'
      : 'border-transparent text-(--text-primary) hover:bg-(--bg-hover)'
  }`

function NavItem({
  to,
  icon: Icon,
  end,
  children,
}: {
  to: string
  icon: LucideIcon
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
    <aside className="h-full w-55 shrink-0 overflow-y-auto border-r border-border bg-(--bg-surface) p-4 flex flex-col">
      <div className="mb-6 px-1">
        <div className="glow-heading font-heading text-3xl text-accent">
          QUACKHUB
        </div>
        <div className="text-xs text-(--text-muted)">[ pato ]</div>
      </div>

      <div className="mb-4">
        <GlobalSearch />
      </div>

      <div className="mb-4 [&>button]:h-10 [&>button]:w-full [&>button]:text-sm">
        <CardCreateModal />
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem to="/inbox" icon={Inbox}>
          Inbox
          {inboxCount > 0 && (
            <span className="ml-auto text-xs text-(--text-muted)">
              {inboxCount}
            </span>
          )}
        </NavItem>
        <NavItem to="/rascunhos" icon={PenLine}>
          Rascunhos
          {draftsCount > 0 && (
            <span className="ml-auto text-xs text-(--text-muted)">
              {draftsCount}
            </span>
          )}
        </NavItem>
        <NavItem to="/board" icon={Columns3}>
          Sprint atual
        </NavItem>
        <NavItem to="/backlog" icon={List}>
          Backlog
        </NavItem>
        <NavItem to="/sprints" icon={History}>
          Histórico
        </NavItem>
        <div className={navLinkClass({ isActive: false })}>
          <button
            type="button"
            onClick={() => setIsProjectsOpen((open) => !open)}
            aria-expanded={isProjectsOpen}
            className="flex flex-1 items-center gap-3 text-left"
          >
            <ChevronRight
              size={14}
              aria-hidden="true"
              className={`transition-transform ${isProjectsOpen ? 'rotate-90' : ''}`}
            />
            Projetos
          </button>
          <ProjectCreateModal />
        </div>

        {isProjectsOpen && (
          <div className="flex flex-col gap-1">
            {isLoading && <LoadingText />}
            {projects?.map((project) => (
              <div
                key={project.id}
                className="group flex items-center rounded-md border border-border bg-(--bg-card)"
              >
                <NavLink
                  to={`/board?project=${project.id}`}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-sm text-(--text-primary)"
                >
                  <Folder size={14} aria-hidden="true" />
                  {project.name}
                </NavLink>
                <button
                  type="button"
                  onClick={() => setEditingProject(project)}
                  className="p-2 text-(--text-muted) opacity-0 group-hover:opacity-100"
                  aria-label={`Editar projeto ${project.name}`}
                >
                  <Pencil size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        <NavItem to="/configuracoes" icon={Settings}>
          Configurações
        </NavItem>
      </div>

      <ProjectEditModal
        project={editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      />
    </aside>
  )
}
