import type { IconComponent } from '@/lib/icons'

type PageTitleProps = {
  title: string
  count?: number
  icon?: IconComponent
}

export function PageTitle({ title, count, icon: Icon }: PageTitleProps) {
  return (
    <div className="flex items-center gap-3 border-l-4 border-accent pl-3">
      {Icon && <Icon size={24} aria-hidden="true" className="text-accent" />}
      <span className="font-heading text-3xl uppercase text-(--text-primary)">
        {title}
      </span>
      {count !== undefined && (
        <span className="flex size-6 items-center justify-center rounded-md border border-border text-xs text-(--text-muted)">
          {count}
        </span>
      )}
    </div>
  )
}
