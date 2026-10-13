import { Input } from '@/components/ui/input'
import { Panel } from '@/components/ui/panel'
import { SectionLabel } from '@/components/ui/section-label'
import {
  MOOD_LEVELS,
  type MoodLevel,
} from '@/features/dailyTracker/lib/dailyTracker'
import {
  DAILY_TRACKER_TEXTS,
  MOOD_LABELS,
} from '@/features/dailyTracker/constants/texts'
import { MOOD_ICONS } from '@/features/dailyTracker/components/moodIcons'
import { MoodHistory } from '@/features/dailyTracker/components/MoodHistory'
import type { MoodDay } from '@/features/dailyTracker/hooks/useDailyTrackerPage'
import { IconMoodGood } from '@/shared/lib/icons'
import { cn } from '@/shared/lib/utils'

type WellnessLogProps = {
  mood: MoodLevel | null
  comment: string
  onMoodChange: (mood: MoodLevel) => void
  onCommentSave: (text: string) => void
  historyLabel: string
  history: MoodDay[]
}

export function WellnessLog({
  mood,
  comment,
  onMoodChange,
  onCommentSave,
  historyLabel,
  history,
}: WellnessLogProps) {
  return (
    <Panel className="flex flex-col gap-4">
      <SectionLabel icon={IconMoodGood}>
        {DAILY_TRACKER_TEXTS.wellnessTitle}
      </SectionLabel>

      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label={DAILY_TRACKER_TEXTS.wellnessTitle}
      >
        {MOOD_LEVELS.map((level) => {
          const Icon = MOOD_ICONS[level]
          const isSelected = mood === level
          return (
            <button
              key={level}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onMoodChange(level)}
              className={cn(
                'flex w-20 flex-col items-center gap-1 rounded-sm border px-2 py-2 text-xs transition-colors',
                isSelected
                  ? 'glow-active border-accent bg-selected text-accent'
                  : 'border-transparent text-fg-muted hover:bg-hover hover:text-fg',
              )}
            >
              <Icon size={24} aria-hidden="true" />
              {MOOD_LABELS[level]}
            </button>
          )
        })}
      </div>

      <Input
        key={comment}
        defaultValue={comment}
        placeholder={
          mood
            ? DAILY_TRACKER_TEXTS.commentPlaceholder
            : DAILY_TRACKER_TEXTS.commentNeedsMood
        }
        aria-label={DAILY_TRACKER_TEXTS.commentLabel}
        disabled={!mood}
        onBlur={(e) => onCommentSave(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
      />

      <MoodHistory label={historyLabel} days={history} />
    </Panel>
  )
}
