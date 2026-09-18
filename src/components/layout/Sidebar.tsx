import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded-[--radius-md] text-base ${
    isActive
      ? 'bg-[--bg-selected] text-[--text-primary]'
      : 'text-[--text-muted]'
  }`

export function Sidebar() {
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
        <div className="text-xs text-[--text-muted] uppercase tracking-wide mb-2 px-3">
          Projetos
        </div>
        <div className="px-3 text-sm text-[--text-muted]">
          (lista dinâmica — Etapa 4)
        </div>
      </div>

      <div className="mt-auto">
        <NavLink to="/configuracoes" className={navLinkClass}>
          Configurações
        </NavLink>
      </div>
    </aside>
  )
}
