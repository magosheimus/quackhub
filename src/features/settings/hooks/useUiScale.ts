import { useState } from 'react'
import {
  applyUiScale,
  loadUiScale,
  saveUiScale,
  type UiScale,
} from '@/features/settings/lib/uiScale'

export function useUiScale() {
  const [uiScale, setUiScaleState] = useState(loadUiScale)

  function setUiScale(scale: UiScale) {
    setUiScaleState(scale)
    saveUiScale(scale)
    applyUiScale(scale)
  }

  return { uiScale, setUiScale }
}
