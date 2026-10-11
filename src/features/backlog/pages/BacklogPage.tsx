import { IconPlus, IconBulletlist, IconChevronRight } from '@/shared/lib/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STATUS_LABELS } from '@/features/tasks/lib/taskStatus'
import { PRIORITY_CONFIG } from '@/features/tasks/lib/taskPriority'
import { BacklogRow } from '@/features/backlog/components/BacklogRow'
import { useBacklogPage } from '@/features/backlog/hooks/useBacklogPage'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/shared/lib/enums'
import { AnimatePresence } from 'framer-motion'
import { LoadingText } from '@/components/ui/loading-text'
import { Button } from '@/components/ui/button'
import { EpicManageModal } from '@/features/epics/components/EpicManageModal'
import { PageTitle } from '@/components/ui/page-title'

const NONE_VALUE = '__all__'

export function BacklogPage() {
  const {
    projects,
    epics,
    isLoadingProjects,
    isLoadingTasks,
    projectFilter,
    statusFilter,
    priorityFilter,
    epicFilter,
    selectedProject,
    selectedEpicName,
    selectProject,
    selectStatus,
    selectPriority,
    selectEpic,
    isEpicModalOpen,
    setIsEpicModalOpen,
    filteredTasks,
    projectGroups,
    projectPrefixById,
    getEpicName,
    toggleProject,
    isProjectCollapsed,
    canAddToSprint,
    addToSprint,
    addAllToSprint,
  } = useBacklogPage()

  if (isLoadingProjects) {
    return <LoadingText />
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Backlog"
        icon={IconBulletlist}
        count={filteredTasks.length}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIsEpicModalOpen(true)}>
          <IconPlus size={16} aria-hidden="true" />
          Criar épico
        </Button>

        {isEpicModalOpen && (
          <EpicManageModal
            initialProjectId={projectFilter}
            open={isEpicModalOpen}
            onOpenChange={setIsEpicModalOpen}
          />
        )}

        <Select
          value={projectFilter ?? NONE_VALUE}
          onValueChange={(v) => selectProject(v === NONE_VALUE ? null : v)}
        >
          <SelectTrigger>
            <SelectValue>
              {projectFilter
                ? (selectedProject?.name ?? 'Projeto')
                : 'Todos os projetos'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todos os projetos</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter ?? NONE_VALUE} onValueChange={selectStatus}>
          <SelectTrigger>
            <SelectValue>
              {statusFilter ? STATUS_LABELS[statusFilter] : 'Todos os status'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todos os status</SelectItem>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter ?? NONE_VALUE}
          onValueChange={selectPriority}
        >
          <SelectTrigger>
            <SelectValue>
              {priorityFilter
                ? PRIORITY_CONFIG[priorityFilter].text
                : 'Todas as prioridades'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Todas as prioridades</SelectItem>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {PRIORITY_CONFIG[priority].text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {projectFilter && (
          <Select
            value={epicFilter ?? NONE_VALUE}
            onValueChange={(v) => selectEpic(v === NONE_VALUE ? null : v)}
          >
            <SelectTrigger>
              <SelectValue>{selectedEpicName ?? 'Todos os épicos'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>Todos os épicos</SelectItem>
              {epics?.map((epic) => (
                <SelectItem key={epic.id} value={epic.id}>
                  {epic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {isLoadingTasks && <LoadingText />}
        {!isLoadingTasks && filteredTasks.length === 0 && (
          <div className="text-sm text-(--text-muted)">
            — nenhum card no backlog —
          </div>
        )}
        {projectGroups.map((group) => {
          const { project, tasks } = group
          const isCollapsed = isProjectCollapsed(project.id)

          return (
            <section key={project.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  aria-expanded={!isCollapsed}
                  className="flex items-center gap-2 font-heading text-xl uppercase text-(--text-primary)"
                >
                  <IconChevronRight
                    size={12}
                    aria-hidden="true"
                    className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                  />
                  {project.name}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-(--text-muted)">
                    {tasks.length}
                  </span>
                  {canAddToSprint && (
                    <Button size="sm" onClick={() => addAllToSprint(group)}>
                      <IconPlus size={12} aria-hidden="true" />
                      Adicionar todos
                    </Button>
                  )}
                </div>
              </div>
              {!isCollapsed && (
                <AnimatePresence>
                  {tasks.map((task) => (
                    <BacklogRow
                      key={task.id}
                      task={task}
                      projectPrefixById={projectPrefixById}
                      epicName={getEpicName(task)}
                      onAddToSprint={
                        canAddToSprint
                          ? () => addToSprint(task, project)
                          : undefined
                      }
                    />
                  ))}
                </AnimatePresence>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
