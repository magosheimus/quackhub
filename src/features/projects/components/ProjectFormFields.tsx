import type { Ref } from 'react'
import { ColorSwatchPicker } from '@/components/pickers/color-swatch-picker'
import { InlineHint } from '@/components/feedback/inline-hint'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PROJECTS_TEXTS,
  PROJECT_TYPE_LABELS,
} from '@/features/projects/constants/texts'
import { isStudyProject } from '@/features/projects/lib/project'
import { COMMON_TEXTS } from '@/shared/constants/texts'
import { isProjectType, PROJECT_TYPES } from '@/shared/lib/enums'
import { IconRefresh } from '@/shared/lib/icons'
import type { PaletteColor } from '@/shared/lib/palette'
import type { ProjectType } from '@/shared/types/entities'
import { HintTooltip } from '@/components/feedback/hint-tooltip'

type ProjectFormFieldsProps = {
  idPrefix: string
  name: string
  prefix: string
  type: ProjectType
  color: PaletteColor
  onNameChange: (name: string) => void
  onPrefixChange: (prefix: string) => void
  onTypeChange: (type: ProjectType) => void
  onColorChange: (color: PaletteColor) => void
  nameInputRef?: Ref<HTMLInputElement>
}

export function ProjectFormFields({
  idPrefix,
  name,
  prefix,
  type,
  color,
  onNameChange,
  onPrefixChange,
  onTypeChange,
  onColorChange,
  nameInputRef,
}: ProjectFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-name`} className="text-caption">
            {COMMON_TEXTS.name}
          </label>
          <Input
            id={`${idPrefix}-name`}
            ref={nameInputRef}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={PROJECTS_TEXTS.namePlaceholder}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <HintTooltip text={PROJECTS_TEXTS.hintPrefix}>
            <label htmlFor={`${idPrefix}-prefix`} className="text-caption">
              {PROJECTS_TEXTS.prefix}
            </label>
          </HintTooltip>
          <Input
            id={`${idPrefix}-prefix`}
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value.toUpperCase())}
            placeholder={PROJECTS_TEXTS.prefixPlaceholder}
            maxLength={6}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <HintTooltip text={PROJECTS_TEXTS.hintType}>
          <span id={`${idPrefix}-type`} className="text-caption">
            {PROJECTS_TEXTS.type}
          </span>
        </HintTooltip>
        <Select
          value={type}
          onValueChange={(value) => {
            if (isProjectType(value)) {
              onTypeChange(value)
            }
          }}
        >
          <SelectTrigger
            aria-labelledby={`${idPrefix}-type`}
            className="w-full"
          >
            <SelectValue>{PROJECT_TYPE_LABELS[type]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PROJECT_TYPES.map((option) => (
              <SelectItem key={option} value={option}>
                {PROJECT_TYPE_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isStudyProject({ type }) && (
        <InlineHint icon={IconRefresh}>
          {PROJECTS_TEXTS.studyProjectHint}
        </InlineHint>
      )}

      <div className="flex flex-col gap-1.5">
        <span id={`${idPrefix}-color`} className="text-caption">
          {PROJECTS_TEXTS.color}
        </span>
        <ColorSwatchPicker
          value={color}
          onChange={onColorChange}
          aria-labelledby={`${idPrefix}-color`}
        />
      </div>
    </div>
  )
}
