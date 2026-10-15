import { createEnumGuard } from '@/shared/lib/enums'

export const LETTERS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
] as const

export type Letter = (typeof LETTERS)[number]

const isLetter = createEnumGuard(LETTERS)

export function getInitialLetter(name: string): Letter | null {
  const initial = name.trim().normalize('NFD').charAt(0).toLowerCase()
  return isLetter(initial) ? initial : null
}
