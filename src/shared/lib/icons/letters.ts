import { createIcon, type IconComponent } from './createIcon'
import type { Letter } from '@/shared/lib/letters'
import { LetterA } from 'pixelarticons/react/LetterA'
import { LetterB } from 'pixelarticons/react/LetterB'
import { LetterC } from 'pixelarticons/react/LetterC'
import { LetterD } from 'pixelarticons/react/LetterD'
import { LetterE } from 'pixelarticons/react/LetterE'
import { LetterF } from 'pixelarticons/react/LetterF'
import { LetterG } from 'pixelarticons/react/LetterG'
import { LetterH } from 'pixelarticons/react/LetterH'
import { LetterI } from 'pixelarticons/react/LetterI'
import { LetterJ } from 'pixelarticons/react/LetterJ'
import { LetterK } from 'pixelarticons/react/LetterK'
import { LetterL } from 'pixelarticons/react/LetterL'
import { LetterM } from 'pixelarticons/react/LetterM'
import { LetterN } from 'pixelarticons/react/LetterN'
import { LetterO } from 'pixelarticons/react/LetterO'
import { LetterP } from 'pixelarticons/react/LetterP'
import { LetterQ } from 'pixelarticons/react/LetterQ'
import { LetterR } from 'pixelarticons/react/LetterR'
import { LetterS } from 'pixelarticons/react/LetterS'
import { LetterT } from 'pixelarticons/react/LetterT'
import { LetterU } from 'pixelarticons/react/LetterU'
import { LetterV } from 'pixelarticons/react/LetterV'
import { LetterW } from 'pixelarticons/react/LetterW'
import { LetterX } from 'pixelarticons/react/LetterX'
import { LetterY } from 'pixelarticons/react/LetterY'
import { LetterZ } from 'pixelarticons/react/LetterZ'

export const LETTER_ICONS: Record<Letter, IconComponent> = {
  a: createIcon(LetterA),
  b: createIcon(LetterB),
  c: createIcon(LetterC),
  d: createIcon(LetterD),
  e: createIcon(LetterE),
  f: createIcon(LetterF),
  g: createIcon(LetterG),
  h: createIcon(LetterH),
  i: createIcon(LetterI),
  j: createIcon(LetterJ),
  k: createIcon(LetterK),
  l: createIcon(LetterL),
  m: createIcon(LetterM),
  n: createIcon(LetterN),
  o: createIcon(LetterO),
  p: createIcon(LetterP),
  q: createIcon(LetterQ),
  r: createIcon(LetterR),
  s: createIcon(LetterS),
  t: createIcon(LetterT),
  u: createIcon(LetterU),
  v: createIcon(LetterV),
  w: createIcon(LetterW),
  x: createIcon(LetterX),
  y: createIcon(LetterY),
  z: createIcon(LetterZ),
}
