import {
  IconMoodExhausted,
  IconMoodGood,
  IconMoodGreat,
  IconMoodNeutral,
  IconMoodTired,
  type IconComponent,
} from '@/shared/lib/icons'
import type { MoodLevel } from '@/features/dailyTracker/lib/dailyTracker'

export const MOOD_ICONS: Record<MoodLevel, IconComponent> = {
  1: IconMoodExhausted,
  2: IconMoodTired,
  3: IconMoodNeutral,
  4: IconMoodGood,
  5: IconMoodGreat,
}
