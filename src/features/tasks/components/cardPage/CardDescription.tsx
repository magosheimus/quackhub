import { Textarea } from '@/components/ui/textarea'

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
      <label
        htmlFor="card-description"
        className="text-sm font-medium text-(--text-primary)"
      >
        Descrição
      </label>
      <Textarea
        id="card-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Adicionar contexto..."
      />
    </div>
  )
}
