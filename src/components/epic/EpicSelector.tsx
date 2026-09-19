import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEpics } from '@/hooks/epics/useEpics'

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
        <SelectValue placeholder="Selecionar épico" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>Sem épico</SelectItem>
        {epics?.map((epic) => (
          <SelectItem key={epic.id} value={epic.id}>
            {epic.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
