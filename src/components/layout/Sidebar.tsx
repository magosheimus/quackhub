import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { useProjects } from '@/hooks/projects/useProjects'
import { ProjectCreateModal } from '../project/ProjectCreateModal'
import { ProjectEditModal } from '../project/ProjectEditModal'
import type { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded-[--radius-md] text-base ${
    isActive
      ? 'bg-[--bg-selected] text-[--text-primary]'
      : 'text-[--text-muted]'
  }`

export function Sidebar() {
  const { data: projects, isLoading } = useProjects()
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  return (
    <aside className="w-55 shrink-0 border-r border-[--border] bg-[--bg-surface] p-4 flex flex-col">
      <div className="font-heading text-xl text-[--text-primary] mb-6">
        [ pato ] QUACKHUB
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink to="/" className={navLinkClass} end>
          Agenda
        </NavLink>
        <NavLink to="/inbox" className={navLinkClass}>
          Inbox
        </NavLink>
      </nav>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2 px-3">
          <span className="text-xs text-[--text-muted] uppercase tracking-wide">
            Projetos
          </span>
          <ProjectCreateModal />
        </div>

        <div className="flex flex-col gap-1">
          {isLoading && (
            <div className="px-3 text-sm text-[--text-muted]">
              [ CARREGANDO........ ]
            </div>
          )}
          {projects?.map((project) => (
            <div key={project.id} className="group flex items-center">
              <NavLink
                to={`/projeto/${project.id}`}
                className={(props) => `${navLinkClass(props)} flex-1`}
              >
                {project.name}
              </NavLink>
              <button
                type="button"
                onClick={() => setEditingProject(project)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[--text-muted]"
                aria-label={`Editar projeto ${project.name}`}
              >
                <Pencil size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <NavLink to="/configuracoes" className={navLinkClass}>
          Configurações
        </NavLink>
      </div>

      <ProjectEditModal
        project={editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      />
    </aside>
  )
}
