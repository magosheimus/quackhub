import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ALL_SCOPE, CURRENT_SCOPE } from '@/features/analytics/lib/analytics'

type AnalyticsScopeSelectProps = {
  scope: string
  scopeLabel: string
  closedSprints: { id: string; name: string }[]
  onChange: (scope: string) => void
}

export function AnalyticsScopeSelect({
  scope,
  scopeLabel,
  closedSprints,
  onChange,
}: AnalyticsScopeSelectProps) {
  return (
    <Select
      value={scope}
      onValueChange={(value) => onChange(value ?? CURRENT_SCOPE)}
    >
      <SelectTrigger aria-label="Escopo da análise" className="w-fit">
        <SelectValue>{scopeLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CURRENT_SCOPE}>Sprint atual</SelectItem>
        {closedSprints.map((sprint) => (
          <SelectItem key={sprint.id} value={sprint.id}>
            {sprint.name}
          </SelectItem>
        ))}
        <SelectItem value={ALL_SCOPE}>Todos os projetos</SelectItem>
      </SelectContent>
    </Select>
  )
}
