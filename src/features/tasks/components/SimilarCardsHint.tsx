import type { Task } from '@/features/tasks/model/task'
import { TASKS_TEXTS } from '@/features/tasks/constants/texts'

type SimilarCardsHintProps = {
  cards: Task[]
}

export function SimilarCardsHint({ cards }: SimilarCardsHintProps) {
  if (cards.length === 0) return null

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface p-2">
      <span className="text-caption">{TASKS_TEXTS.similarCards}</span>
      {cards.slice(0, 5).map((card) => (
        <span key={card.id} className="text-xs text-fg">
          {card.title} — {card.createdAt?.slice(0, 10)}
        </span>
      ))}
    </div>
  )
}
