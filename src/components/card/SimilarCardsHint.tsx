import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

type SimilarCardsHintProps = {
  cards: Task[]
}

export function SimilarCardsHint({ cards }: SimilarCardsHintProps) {
  if (cards.length === 0) return null

  return (
    <div className="flex flex-col gap-1 rounded-[--radius-md] border border-[--border] bg-[var(--bg-surface)] p-2">
      <span className="text-xs text-[--text-muted]">Histórico:</span>
      {cards.slice(0, 5).map((card) => (
        <span key={card.id} className="text-xs text-[--text-primary]">
          {card.title} — {card.created_at?.slice(0, 10)}
        </span>
      ))}
    </div>
  )
}
