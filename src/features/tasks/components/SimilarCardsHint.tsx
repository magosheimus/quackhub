import type { Task } from '@/shared/types/entities'

type SimilarCardsHintProps = {
  cards: Task[]
}

export function SimilarCardsHint({ cards }: SimilarCardsHintProps) {
  if (cards.length === 0) return null

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-(--bg-surface) p-2">
      <span className="text-xs text-(--text-muted)">Histórico:</span>
      {cards.slice(0, 5).map((card) => (
        <span key={card.id} className="text-xs text-(--text-primary)">
          {card.title} — {card.created_at?.slice(0, 10)}
        </span>
      ))}
    </div>
  )
}
