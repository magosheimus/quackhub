type SectionTitleProps = {
  children: string
  hint?: string
}

export function SectionTitle({ children, hint }: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-2">
      <h2 className="font-heading text-xl uppercase text-(--text-primary)">
        {children}
      </h2>
      {hint && <span className="text-xs text-(--text-muted)">{hint}</span>}
    </div>
  )
}
