import {
  paletteVar,
  toPaletteColor,
  type PaletteColor,
} from '@/shared/lib/palette'
import { createEnumGuard } from '@/shared/lib/enums'
import type { Habit } from '@/shared/types/entities'

export const HABIT_ICON_KEYS = [
  'target',
  'briefcase',
  'code',
  'book',
  'notebook',
  'pencil',
  'feather',
  'languages',
  'water',
  'mug',
  'tea',
  'apple',
  'potion',
  'heart',
  'exercise',
  'scale',
  'bed',
  'sofa',
  'moon',
  'sun',
  'leaf',
  'tree',
  'dog',
  'music',
  'headphone',
  'brush',
  'gamepad',
  'coins',
  'home',
  'spray',
  'noSmoking',
  'users',
  'fire',
  'star',
] as const

export type HabitIconKey = (typeof HABIT_ICON_KEYS)[number]

export const DEFAULT_HABIT_ICON: HabitIconKey = 'target'

export const isHabitIconKey = createEnumGuard(HABIT_ICON_KEYS)

export function getHabitIconKey(habit?: Pick<Habit, 'icon'>): HabitIconKey {
  return isHabitIconKey(habit?.icon) ? habit.icon : DEFAULT_HABIT_ICON
}

export function getHabitColor(
  habit?: Pick<Habit, 'color'>,
): PaletteColor | null {
  return toPaletteColor(habit?.color)
}

export function resolveHabitColor(color: PaletteColor | null): string {
  return color ? paletteVar(color) : 'var(--accent)'
}
