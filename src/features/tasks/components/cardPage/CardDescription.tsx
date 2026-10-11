import { Textarea } from '@/components/ui/textarea'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

type CardDescriptionProps = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function CardDescription({
  value,
  onChange,
  onBlur,
}: CardDescriptionProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="card-description" className="text-sm font-medium text-fg">
        {TASKS_TEXTS.description}
      </label>
      <Textarea
        id="card-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={TASKS_TEXTS.descriptionPlaceholder}
      />
    </div>
  )
}
