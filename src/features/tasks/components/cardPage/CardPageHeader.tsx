import { IconArrowLeft, IconFolder } from '@/shared/lib/icons'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/ui/page-title'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'
import { ProjectCode } from '@/features/projects/components/ProjectCode'
import { EpicTag } from '@/features/epics/components/EpicTag'
import type { ProjectLabel } from '@/features/projects/lib/project'
import type { EpicLabel } from '@/features/epics/lib/epic'

type CardPageHeaderProps = {
  taskNumber: number | null
  projectLabel?: ProjectLabel
  epicLabel?: EpicLabel
  title: string
  isEditingTitle: boolean
  onTitleChange: (value: string) => void
  onTitleFocus: () => void
  onTitleBlur: () => void
  onBack: () => void
}

export function CardPageHeader({
  taskNumber,
  projectLabel,
  epicLabel,
  title,
  isEditingTitle,
  onTitleChange,
  onTitleFocus,
  onTitleBlur,
  onBack,
}: CardPageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onBack}
        aria-label={TASKS_TEXTS.back}
      >
        <IconArrowLeft size={16} />
      </Button>

      <PageTitle icon={IconFolder} iconSize={48} withAccentBar={false}>
        <div className="flex flex-col gap-0.5">
          {taskNumber && (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2">
              <ProjectCode label={projectLabel} taskNumber={taskNumber} />
              {epicLabel && <EpicTag label={epicLabel} withColor={false} />}
            </span>
          )}
          <input
            value={title}
            size={Math.max(title.length, 10)}
            onChange={(e) => onTitleChange(e.target.value)}
            onFocus={onTitleFocus}
            onBlur={onTitleBlur}
            aria-label={TASKS_TEXTS.titleLabel}
            className={`h-8 rounded-md px-2 py-0 font-heading text-3xl leading-tight text-fg outline-none ${
              isEditingTitle
                ? 'border border-border bg-transparent shadow-[inset_1px_1px_2px_color-mix(in_srgb,var(--lcd-ink)_20%,transparent),inset_-1px_-1px_0_color-mix(in_srgb,var(--lcd-screen)_40%,transparent)]'
                : 'input-static'
            }`}
          />
        </div>
      </PageTitle>
    </div>
  )
}
