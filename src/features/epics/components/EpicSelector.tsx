import { useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  NEW_EPIC_VALUE,
  NONE_VALUE,
  useEpicSelector,
} from '@/features/epics/hooks/useEpicSelector'
import { EPICS_TEXTS } from '@/features/epics/constants/texts'

type EpicSelectorProps = {
  projectId: string
  value: string | null
  onChange: (epicId: string | null) => void
  newEpicName: string | null
  onNewEpicNameChange: (name: string | null) => void
}

export function EpicSelector({
  projectId,
  value,
  onChange,
  newEpicName,
  onNewEpicNameChange,
}: EpicSelectorProps) {
  const { epics, isLoading, select } = useEpicSelector(
    projectId,
    onChange,
    () => onNewEpicNameChange(''),
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const isAdding = newEpicName !== null

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  if (isAdding) {
    return (
      <Input
        ref={inputRef}
        value={newEpicName}
        placeholder={EPICS_TEXTS.namePlaceholder}
        aria-label={EPICS_TEXTS.namePlaceholder}
        onChange={(e) => onNewEpicNameChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            onNewEpicNameChange(null)
          }
        }}
      />
    )
  }

  return (
    <Select
      value={value ?? NONE_VALUE}
      onValueChange={select}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue>
          {value
            ? epics?.find((e) => e.id === value)?.name
            : EPICS_TEXTS.selectEpic}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>{EPICS_TEXTS.noEpic}</SelectItem>
        {epics?.map((epic) => (
          <SelectItem key={epic.id} value={epic.id}>
            {epic.name}
          </SelectItem>
        ))}
        <SelectItem value={NEW_EPIC_VALUE}>{EPICS_TEXTS.newEpic}</SelectItem>
      </SelectContent>
    </Select>
  )
}
