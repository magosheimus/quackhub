import { CartuchoOptions } from '@/features/settings/components/CartuchoOptions'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function CartuchoMenu() {
  const { settings, updateSettings } = useSettings()

  return (
    <CartuchoOptions
      selected={settings.cartucho}
      onSelect={(cartucho) => updateSettings({ cartucho })}
      size="compact"
      className="grid grid-cols-3 justify-items-center gap-1"
    />
  )
}
