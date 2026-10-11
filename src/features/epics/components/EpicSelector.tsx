import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEpics } from '@/features/epics/hooks/useEpics'
import { EPICS_TEXTS } from '@/features/epics/constants/texts'

type EpicSelectorProps = {
  projectId: string
  value: string | null
  onChange: (epicId: string | null) => void
}

const NONE_VALUE = '__none__'

export function EpicSelector({
  projectId,
  value,
  onChange,
}: EpicSelectorProps) {
  const { data: epics, isLoading } = useEpics(projectId)

  return (
    <Select
      value={value ?? NONE_VALUE}
      onValueChange={(v) => onChange(v === NONE_VALUE ? null : v)}
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
      </SelectContent>
    </Select>
  )
}
