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
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { BACKLOG_TEXTS } from '@/features/backlog/constants/texts'

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
        title={BACKLOG_TEXTS.title}
        icon={IconBulletlist}
        count={filteredTasks.length}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIsEpicModalOpen(true)}>
          <IconPlus size={16} aria-hidden="true" />
          {COMMON_TEXTS.createEpic}
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
                ? (selectedProject?.name ?? BACKLOG_TEXTS.project)
                : COMMON_TEXTS.allProjects}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              {COMMON_TEXTS.allProjects}
            </SelectItem>
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
              {statusFilter
                ? STATUS_LABELS[statusFilter]
                : BACKLOG_TEXTS.allStatuses}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              {BACKLOG_TEXTS.allStatuses}
            </SelectItem>
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
                : BACKLOG_TEXTS.allPriorities}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              {BACKLOG_TEXTS.allPriorities}
            </SelectItem>
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
              <SelectValue>
                {selectedEpicName ?? BACKLOG_TEXTS.allEpics}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                {BACKLOG_TEXTS.allEpics}
              </SelectItem>
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
            {BACKLOG_TEXTS.empty}
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
                      {BACKLOG_TEXTS.addAll}
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
